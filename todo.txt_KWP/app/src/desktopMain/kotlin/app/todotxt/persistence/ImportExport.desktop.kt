package app.todotxt.persistence

import java.io.File
import javax.swing.JFileChooser
import javax.swing.filechooser.FileNameExtensionFilter

/** Desktop: JFileChooser for picking an external todo.txt (import) and saving
 * a copy of the current document (export). */
actual fun importTodoDocument(): ImportExportResult = runCatching {
    val fc = JFileChooser(System.getProperty("user.home"))
    fc.fileFilter = FileNameExtensionFilter("Text files (todo.txt)", "txt")
    val rc = fc.showOpenDialog(null)
    if (rc == JFileChooser.APPROVE_OPTION) {
        val file = fc.selectedFile
        if (file != null) ImportExportResult.Imported(file.readText())
        else ImportExportResult.Cancelled
    } else {
        ImportExportResult.Cancelled
    }
}.getOrElse { ImportExportResult.Cancelled }

actual fun exportTodoDocument(content: String): ImportExportResult = runCatching {
    val fc = JFileChooser(System.getProperty("user.home"))
    fc.fileFilter = FileNameExtensionFilter("Text files (todo.txt)", "txt")
    fc.selectedFile = File("todo.txt")
    val rc = fc.showSaveDialog(null)
    if (rc == JFileChooser.APPROVE_OPTION) {
        var file = fc.selectedFile
        if (file != null && !file.name.endsWith(".txt")) {
            file = File(file.parentFile, "${file.name}.txt")
        }
        if (file != null) {
            file.writeText(content)
            ImportExportResult.Shared
        } else {
            ImportExportResult.Cancelled
        }
    } else {
        ImportExportResult.Cancelled
    }
}.getOrElse { ImportExportResult.Cancelled }
