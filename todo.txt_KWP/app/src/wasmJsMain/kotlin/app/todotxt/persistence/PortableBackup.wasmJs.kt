@file:OptIn(kotlin.js.ExperimentalWasmJsInterop::class)

package app.todotxt.persistence

import kotlin.js.js


actual object PortableBackup {
    actual fun export(passphrase: String) {
        if (passphrase.length < 8) {
            BackupManager.setPortableStatus(
                PortableBackupStatus.Failed("Use at least 8 characters for the backup passphrase"),
            )
            return
        }
        BackupManager.setPortableStatus(PortableBackupStatus.Exporting)
        val payload = BackupManager.exportPortablePayload()
        encryptAndDownload(payload, passphrase, {
            BackupManager.setPortableStatus(PortableBackupStatus.Completed)
        }, { message ->
            BackupManager.setPortableStatus(PortableBackupStatus.Failed(message))
        })
    }

    actual fun import(passphrase: String) {
        if (passphrase.length < 8) {
            BackupManager.setPortableStatus(
                PortableBackupStatus.Failed("Use the passphrase that protected the backup"),
            )
            return
        }
        BackupManager.setPortableStatus(PortableBackupStatus.Importing)
        pickBackupFile({ raw ->
            decryptBackup(raw, passphrase, { payload ->
                if (BackupManager.restorePortablePayload(payload)) {
                    BackupManager.setPortableStatus(PortableBackupStatus.Completed)
                } else {
                    BackupManager.setPortableStatus(
                        PortableBackupStatus.Failed("Backup data is invalid"),
                    )
                }
            }, { message ->
                BackupManager.setPortableStatus(PortableBackupStatus.Failed(message))
            })
        }, { message ->
            BackupManager.setPortableStatus(PortableBackupStatus.Failed(message))
        })
    }
}

private fun encryptAndDownload(
    payload: String,
    passphrase: String,
    onCompleted: () -> Unit,
    onFailed: (String) -> Unit,
): Unit = js(
    """{
        (async () => {
            try {
                const bytesToBase64 = (bytes) => {
                    let binary = '';
                    for (const byte of bytes) binary += String.fromCharCode(byte);
                    return btoa(binary);
                };
                const salt = crypto.getRandomValues(new Uint8Array(16));
                const iv = crypto.getRandomValues(new Uint8Array(12));
                const material = await crypto.subtle.importKey(
                    'raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']
                );
                const key = await crypto.subtle.deriveKey(
                    { name: 'PBKDF2', salt, iterations: ${PortableBackupFormat.ITERATIONS}, hash: 'SHA-256' },
                    material,
                    { name: 'AES-GCM', length: 256 },
                    false,
                    ['encrypt']
                );
                const encrypted = new Uint8Array(await crypto.subtle.encrypt(
                    { name: 'AES-GCM', iv, tagLength: 128 },
                    key,
                    new TextEncoder().encode(payload)
                ));
                const encoded = [salt, iv, encrypted].map(bytesToBase64).join('.');
                const blob = new Blob(['${PortableBackupFormat.PREFIX}\\n' + encoded], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'todotxt-backup.tdb';
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 0);
                onCompleted();
            } catch (error) {
                onFailed(String(error && error.message ? error.message : error));
            }
        })();
    }""",
)

private fun pickBackupFile(
    onText: (String) -> Unit,
    onFailed: (String) -> Unit,
): Unit = js(
    """{
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.tdb,application/octet-stream';
        input.onchange = async () => {
            const file = input.files && input.files[0];
            if (!file) {
                onFailed('Backup import cancelled');
                return;
            }
            try {
                onText(await file.text());
            } catch (error) {
                onFailed(String(error && error.message ? error.message : error));
            }
        };
        input.click();
    }""",
)

private fun decryptBackup(
    raw: String,
    passphrase: String,
    onPayload: (String) -> Unit,
    onFailed: (String) -> Unit,
): Unit = js(
    """{
        (async () => {
            try {
                const base64ToBytes = (value) => {
                    const binary = atob(value);
                    const bytes = new Uint8Array(binary.length);
                    for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
                    return bytes;
                };
                const lines = raw.trim().split(/\\r?\\n/, 2);
                if (lines[0] !== '${PortableBackupFormat.PREFIX}') throw new Error('This is not a Todo.Txt backup');
                const parts = (lines[1] || '').split('.');
                if (parts.length !== 3) throw new Error('Backup is incomplete');
                const salt = base64ToBytes(parts[0]);
                const iv = base64ToBytes(parts[1]);
                const encrypted = base64ToBytes(parts[2]);
                const material = await crypto.subtle.importKey(
                    'raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']
                );
                const key = await crypto.subtle.deriveKey(
                    { name: 'PBKDF2', salt, iterations: ${PortableBackupFormat.ITERATIONS}, hash: 'SHA-256' },
                    material,
                    { name: 'AES-GCM', length: 256 },
                    false,
                    ['decrypt']
                );
                const plaintext = await crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv, tagLength: 128 }, key, encrypted
                );
                onPayload(new TextDecoder().decode(plaintext));
            } catch (error) {
                onFailed('Could not restore backup: ' + String(error && error.message ? error.message : 'wrong passphrase or damaged file'));
            }
        })();
    }""",
)
