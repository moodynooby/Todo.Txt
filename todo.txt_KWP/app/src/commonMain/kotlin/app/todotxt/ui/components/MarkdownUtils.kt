package app.todotxt.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material3.TextButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp

/** Inline markdown: **bold** and *italic*. */
internal fun AnnotatedString.Builder.appendInlineMarkdown(
    line: String,
    foreground: Color,
) {
    val pattern = Regex("""(\*\*[^*]+\*\*|\*[^*]+\*)""")
    var cursor = 0
    pattern.findAll(line).forEach { match ->
        append(line.substring(cursor, match.range.first))
        val value = match.value
        val marked = value.removePrefix("**").removeSuffix("**")
            .removePrefix("*").removeSuffix("*")
        val style = if (value.startsWith("**")) {
            SpanStyle(fontWeight = FontWeight.Bold, color = foreground)
        } else {
            SpanStyle(fontStyle = androidx.compose.ui.text.font.FontStyle.Italic, color = foreground)
        }
        withStyle(style) { append(marked) }
        cursor = match.range.last + 1
    }
    append(line.substring(cursor))
}

/** Render markdown text to [AnnotatedString] for preview surfaces. */
internal fun renderMarkdown(text: String, foreground: Color): AnnotatedString {
    return buildAnnotatedString {
        val lines = text.split("\n")
        lines.forEachIndexed { index, line ->
            when {
                line.startsWith("# ") -> {
                    withStyle(SpanStyle(fontWeight = FontWeight.Bold, color = foreground)) {
                        append(line)
                    }
                }
                line.startsWith("## ") -> {
                    withStyle(SpanStyle(fontWeight = FontWeight.Bold)) {
                        append(line)
                    }
                }
                line.startsWith("- ") || line.startsWith("* ") -> {
                    withStyle(SpanStyle(color = foreground)) {
                        append("• ")
                    }
                    append(line.substring(2))
                }
                else -> {
                    appendInlineMarkdown(line, foreground)
                }
            }
            if (index < lines.size - 1) append("\n")
        }
    }
}

/** Insert a markdown prefix at the current editing position. */
internal fun insertMarkdown(content: String, prefix: String): String {
    val lineStart = content.lastIndexOf('\n').let { if (it < 0) 0 else it + 1 }
    val selectedLine = content.substring(lineStart)
    return when (prefix) {
        "**text**", "*text*" -> content + if (content.isBlank()) prefix else " $prefix"
        else -> content.substring(0, lineStart) + prefix + selectedLine
    }
}

/** Compact formatting toolbar shared by KMP note and editor surfaces. */
@Composable
internal fun MarkdownToolbar(
    content: String,
    onContentChange: (String) -> Unit,
) {
    Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
        listOf(
            "B" to "**text**",
            "I" to "*text*",
            "H1" to "# ",
            "H2" to "## ",
            "•" to "- ",
            "☑" to "- [ ] ",
        ).forEach { (label, prefix) ->
            TextButton(
                onClick = { onContentChange(insertMarkdown(content, prefix)) },
                modifier = Modifier.size(42.dp),
            ) { Text(label) }
        }
    }
}
