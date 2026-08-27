@file:OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class, androidx.compose.material3.ExperimentalMaterial3Api::class)
package app.todotxt.ui.ai

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.todotxt.core.SharedAiTools
import app.todotxt.core.TodoDocumentValidator
import app.todotxt.domain.GroqSettings
import app.todotxt.domain.TodoParser
import app.todotxt.persistence.Storage
import app.todotxt.ui.PageHeader
import io.ktor.client.HttpClient
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import io.ktor.serialization.kotlinx.json.json
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json

/**
 * AI Tools workspace.
 *
 * Mirrors the web app's user-keyed GROQ setup: the user enters their own API
 * key (never leaves the device outside the direct API call), picks a model,
 * and sends a plain /chat/completions request. No streaming in the
 * experimental build; the response lands as a single card.
 */
private val MODELS = listOf(
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
)

/**
 * AI tool chips (web parity: `aiTools.ts` / AiToolsDialog). The LLM prompts
 * are deterministic wrappers; "Cleanup done" is applied locally without an AI
 * call, matching the web's in-place cleanup.
 */
private val AI_TOOLS = SharedAiTools.all

private val TODO_AI_SYSTEM_PROMPT = """
You are Todo.Txt assistant. Return only plain Todo.Txt task lines, one task per line.
Preserve every priority, creation/completion date, project, context, due: tag, and task meaning unless the selected tool explicitly changes it.
Do not invent metadata. Do not return Markdown, headings, code fences, bullets, explanations, or a preamble.
""".trimIndent()

@OptIn(ExperimentalFoundationApi::class, ExperimentalMaterial3Api::class)
@Composable
fun AiPage() {
    val settings by Storage.groq.collectAsState()
    var apiKey by remember(settings) { mutableStateOf(settings.apiKey ?: "") }
    var model by remember(settings) { mutableStateOf(settings.model) }
    var menuExpanded by remember { mutableStateOf(false) }
    var prompt by remember { mutableStateOf("") }
    var selectedTool by remember { mutableStateOf<app.todotxt.core.AiToolSpec?>(null) }
    var response by remember { mutableStateOf<String?>(null) }
    var error by remember { mutableStateOf<String?>(null) }
    var running by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    Column(
        Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
    ) {
        PageHeader("AI Tools", modifier = Modifier.padding(bottom = 4.dp))
        Text(
            "GROQ — your own API key, called directly.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 16.dp),
        )

        // Tool chips: tap one to pre-fill a structured prompt targeting the
        // current todo.txt document.
        AI_TOOLS.chunked(3).forEach { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                row.forEach { tool ->
                    FilterChip(
                        selected = selectedTool == tool,
                        onClick = { selectedTool = if (selectedTool == tool) null else tool },
                        label = { Text(tool.label) },
                        shape = RoundedCornerShape(16.dp),
                    )
                }
            }
        }

        Spacer(Modifier.height(12.dp))

        OutlinedTextField(
            value = apiKey,
            onValueChange = { apiKey = it },
            label = { Text("API key") },
            placeholder = { Text("gsk_…") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
        )

        Spacer(Modifier.height(8.dp))

        ExposedDropdownMenuBox(
            expanded = menuExpanded,
            onExpandedChange = { menuExpanded = it },
        ) {
            OutlinedTextField(
                value = model,
                onValueChange = {},
                readOnly = true,
                label = { Text("Model") },
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = menuExpanded) },
                modifier = Modifier.fillMaxWidth().menuAnchor(),
            )
            ExposedDropdownMenu(
                expanded = menuExpanded,
                onDismissRequest = { menuExpanded = false },
            ) {
                MODELS.forEach { m ->
                    DropdownMenuItem(
                        text = { Text(m) },
                        onClick = {
                            model = m
                            menuExpanded = false
                        },
                    )
                }
            }
        }

        Spacer(Modifier.height(8.dp))

        OutlinedTextField(
            value = prompt,
            onValueChange = { prompt = it },
            label = { Text("Prompt") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
        )

        Spacer(Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Button(
                onClick = {
                    if (selectedTool?.label == "Cleanup Done") {
                        // Applied locally: remove completed lines from todo.txt.
                        val content = Storage.content.value
                        val lines = content.split("\n")
                            .filter { !TodoParser.parseTodoLine(it).completed }
                        Storage.setContent(lines.joinToString("\n"))
                        response = "Completed tasks removed from todo.txt."
                        selectedTool = null
                    } else if (apiKey.isNotBlank() && prompt.isNotBlank()) {
                        Storage.updateGroq { GroqSettings(apiKey = apiKey, model = model) }
                        running = true
                        error = null
                        response = null
                        val key = apiKey
                        val modelId = model
                        val userPrompt = buildString {
                            selectedTool?.let { tool ->
                                appendLine(tool.instruction)
                                appendLine()
                                appendLine("Below is the current todo.txt:")
                                appendLine(Storage.content.value)
                                appendLine()
                            }
                            append(prompt)
                        }
                        scope.launch {
                            runCatching { runGroqCompletion(key, modelId, userPrompt) }
                                .onSuccess { response = it }
                                .onFailure { error = it.message ?: "Request failed" }
                            running = false
                        }
                    }
                },
                enabled = !running && (prompt.isNotBlank() || selectedTool != null),
                shape = RoundedCornerShape(20.dp),
            ) {
                Text(
                    when {
                        running -> "Thinking…"
                        selectedTool?.label == "Cleanup Done" -> "Cleanup done tasks"
                        else -> "Ask"
                    },
                )
            }
        }

        // Apply only a validated full document, never a partially parseable response.
        response?.let { body ->
            val validation = TodoDocumentValidator.validate(body)
            if (validation.valid) {
                Spacer(Modifier.height(8.dp))
                TextButton(onClick = {
                    Storage.setContent(validation.normalized)
                    response = null
                    error = "AI result applied to todo.txt."
                }) {
                    Text("Previewed result is valid — apply to todo.txt")
                }
            } else {
                Text(
                    validation.error ?: "The AI result is not valid Todo.Txt.",
                    color = MaterialTheme.colorScheme.error,
                )
            }
        }

        Spacer(Modifier.height(16.dp))

        error?.let {
            Text("Error: $it", color = MaterialTheme.colorScheme.error)
        }

        response?.let { body ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                shape = RoundedCornerShape(12.dp),
            ) {
                Text(
                    body,
                    modifier = Modifier.padding(12.dp),
                    style = MaterialTheme.typography.bodyMedium,
                )
            }
        }
    }
}

private fun groqClient(): HttpClient = HttpClient {
    install(ContentNegotiation) {
        json(Json { ignoreUnknownKeys = true })
    }
}

private suspend fun runGroqCompletion(apiKey: String, model: String, prompt: String): String {
    val client = groqClient()
        val body = mapOf(
        "model" to model,
        "messages" to listOf(
            mapOf("role" to "system", "content" to TODO_AI_SYSTEM_PROMPT),
            mapOf("role" to "user", "content" to prompt),
        ),
    )

    val resp = client.post("https://api.groq.com/openai/v1/chat/completions") {
        header("Authorization", "Bearer $apiKey")
        contentType(ContentType.Application.Json)
        setBody(body)
    }
    val text = resp.bodyAsText()
    if (!resp.status.isSuccess()) error("Groq HTTP ${resp.status}: $text")
    val contentStart = text.indexOf("\"content\":\"")
    if (contentStart == -1) error("Unexpected response format")
    val contentText = text.substring(contentStart + "\"content\":\"".length)
    val contentEnd = contentText.indexOf("\"}")
    val raw = if (contentEnd == -1) contentText else contentText.substring(0, contentEnd)
    return raw.replace("\\n", "\n").replace("\\\"", "\"").replace("\\\\", "\\")
}
