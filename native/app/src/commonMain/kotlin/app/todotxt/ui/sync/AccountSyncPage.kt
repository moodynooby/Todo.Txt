package app.todotxt.ui.sync

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import app.todotxt.sync.AccountSyncManager
import app.todotxt.sync.AccountSyncStatus
import app.todotxt.ui.PageHeader

/**
 * Cloud sync page — account sign-in and status for the web-compatible
 * Firebase sync ([AccountSyncManager]). Replaced the former QR/P2P pairing
 * page: devices now converge through the same `users/{uid}` documents the
 * web app uses, so a phone and a desktop sync by signing into the same
 * account, no local network required.
 */
@Composable
fun AccountSyncPage() {
    val status by AccountSyncManager.status.collectAsState()
    val authMessage by AccountSyncManager.authMessage.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        PageHeader(title = "Cloud Sync")

        StatusCard(status)
        authMessage?.let { message ->
            Text(
                message,
                color = MaterialTheme.colorScheme.primary,
                style = MaterialTheme.typography.bodyMedium,
            )
        }

        when (status) {
            is AccountSyncStatus.Synced -> SignOutSection()
            is AccountSyncStatus.Disabled -> Text(
                "Cloud sync is not configured. Add the Firebase project " +
                    "settings to enable it.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            else -> AuthForm()
        }

        Text(
            "Synced through Firebase: todos, notes, habits, timers, and the " +
                "AI key. Drawings and theme stay on this device.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
private fun StatusCard(status: AccountSyncStatus) {
    Surface(
        shape = MaterialTheme.shapes.medium,
        tonalElevation = 2.dp,
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                "Status",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.primary,
            )
            Spacer(modifier = Modifier.height(4.dp))
            val (label, detail) = when (status) {
                AccountSyncStatus.Disabled -> "Disabled" to "Firebase is not configured."
                AccountSyncStatus.SignedOut -> "Signed out" to "Sign in to sync with the web app."
                AccountSyncStatus.Connecting -> "Connecting" to "Talking to Firebase…"
                is AccountSyncStatus.Synced -> "Synced" to status.email
                is AccountSyncStatus.WaitingForNetwork ->
                    "Waiting for network" to status.message
                is AccountSyncStatus.Error -> "Error" to status.message
            }
            Text(
                label,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
            )
            if (detail.isNotBlank()) {
                Text(
                    detail,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

@Composable
private fun SignOutSection() {
    var confirm by remember { mutableStateOf(false) }
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.End,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (confirm) {
            Text(
                "Keep local copies?",
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.weight(1f),
            )
            OutlinedButton(onClick = { confirm = false }) {
                Text("Cancel")
            }
            Button(
                onClick = {
                    AccountSyncManager.signOut()
                    confirm = false
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.error,
                ),
            ) {
                Text("Sign out")
            }
        } else {
            OutlinedButton(onClick = { confirm = true }) {
                Text("Sign out")
            }
        }
    }
}

@Composable
private fun AuthForm() {
    var isCreateMode by remember { mutableStateOf(false) }
    var resetMode by remember { mutableStateOf(false) }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }

    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(
            when {
                resetMode -> "Send a password-reset email"
                isCreateMode -> "Create an account (same one as the web app)"
                else -> "Sign in with the same account as the web app"
            },
            style = MaterialTheme.typography.bodyMedium,
        )
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
        )
        if (resetMode) {
            Button(
                onClick = { AccountSyncManager.sendPasswordReset(email) },
                enabled = email.contains("@"),
                modifier = Modifier.fillMaxWidth(),
            ) { Text("Send reset email") }
            OutlinedButton(
                onClick = { resetMode = false },
                modifier = Modifier.fillMaxWidth(),
            ) { Text("Back to sign in") }
        } else {
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password") },
                singleLine = true,
                visualTransformation = PasswordVisualTransformation(),
                modifier = Modifier.fillMaxWidth(),
            )
            if (isCreateMode) {
                OutlinedTextField(
                    value = confirmPassword,
                    onValueChange = { confirmPassword = it },
                    label = { Text("Confirm password") },
                    singleLine = true,
                    visualTransformation = PasswordVisualTransformation(),
                    modifier = Modifier.fillMaxWidth(),
                )
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Button(
                    onClick = {
                        if (isCreateMode) {
                            AccountSyncManager.createAccount(email, password)
                        } else {
                            AccountSyncManager.signIn(email, password)
                        }
                    },
                    enabled = email.contains("@") && password.length >= 6 &&
                        (!isCreateMode || password == confirmPassword),
                ) {
                    Text(if (isCreateMode) "Create account" else "Sign in")
                }
                OutlinedButton(onClick = {
                    isCreateMode = !isCreateMode
                    confirmPassword = ""
                }) {
                    Text(if (isCreateMode) "I have an account" else "Create an account")
                }
            }
            TextButton(
                onClick = { resetMode = true },
                modifier = Modifier.fillMaxWidth(),
            ) { Text("Forgot password?") }
        }
    }
}
