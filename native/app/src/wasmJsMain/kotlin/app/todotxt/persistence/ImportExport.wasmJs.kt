@file:OptIn(kotlin.js.ExperimentalWasmJsInterop::class)

package app.todotxt.persistence

import kotlin.js.js

private fun openBrowserFilePicker(onText: (String) -> Unit): Unit = js(
    """{
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,text/plain';
        input.onchange = () => {
            const file = input.files && input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => onText(String(reader.result || ''));
            reader.readAsText(file);
        };
        input.click();
    }""",
)


private fun openBrowserText(content: String): Unit = js(
    """{
        window.open('data:text/plain;charset=utf-8,' + encodeURIComponent(content), '_blank');
    }""",
)

actual fun importTodoDocument(): ImportExportResult {
    openBrowserFilePicker { imported ->
        if (imported.isNotEmpty()) ImportExportBridge.onImported?.invoke(imported)
    }
    return ImportExportResult.Cancelled
}

actual fun exportTodoDocument(content: String): ImportExportResult {
    openBrowserText(content)
    ImportExportBridge.onExportShared?.invoke()
    return ImportExportResult.Shared
}
