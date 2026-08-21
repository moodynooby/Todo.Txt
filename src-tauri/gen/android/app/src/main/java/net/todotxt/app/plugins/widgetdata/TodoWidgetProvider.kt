package net.todotxt.app.plugins.widgetdata

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.os.Build
import android.view.View
import android.widget.RemoteViews
import net.todotxt.app.R
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.time.format.DateTimeFormatter

/**
 * Today widget (collection).
 *
 * Renders open tasks due today or already overdue as a scrollable list,
 * each row carrying an interactive mark-done checkbox (Android 12+
 * responsive compound button via `setOnCheckedChangeResponse`; API 30
 * fallback uses a plain RemoteViews click on the row).
 *
 * Data source: `WidgetDataStore` JSON written by the JS widget bridge.
 */
class TodoWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        manager: AppWidgetManager,
        ids: IntArray,
    ) {
        for (id in ids) {
            manager.updateAppWidget(id, buildRemoteViews(context, id))
        }
        // Refresh the collection adapter so new/removed rows render.
        manager.notifyAppWidgetViewDataChanged(ids, R.id.task_list)
    }

    override fun onAppWidgetOptionsChanged(
        context: Context,
        manager: AppWidgetManager,
        id: Int,
        newOptions: android.os.Bundle,
    ) {
        onUpdate(context, manager, intArrayOf(id))
    }

    override fun onEnabled(context: Context) {
        // First placement: force a render now that the widget exists; the
        // data store is populated by the app's normal state pushes.
        onUpdate(context, AppWidgetManager.getInstance(context), intArrayOf())
    }

    private fun buildRemoteViews(context: Context, widgetId: Int): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.widget_todo)
        val store = WidgetDataStore(context)
        val payload = store.read()
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        val today = try {
            payload.date.ifEmpty {
                sdf.format(Date())
            }
        } catch (error: Throwable) {
            sdf.format(Date())
        }

        val dueTasks = payload.tasks.filter { task ->
            !task.done && task.due != null && isDue(task.due, today)
        }

        views.setTextViewText(
            R.id.widget_subtitle,
            "${dueTasks.size} waiting",
        )
        views.setViewVisibility(
            R.id.widget_empty,
            if (dueTasks.isEmpty()) View.VISIBLE else View.GONE,
        )

        // Collection adapter: rows are rendered by the RemoteViewsService.
        views.setRemoteAdapter(R.id.task_list, Intent(context, TodoRemoteViewsService::class.java))
        views.setEmptyView(R.id.task_list, R.id.widget_empty)

        // Tapping the widget header/empty area opens the app.
        views.setOnClickPendingIntent(R.id.widget_root, WidgetHelpers.launchAppIntent(context))

        return views
    }

    private fun isDue(due: String?, today: String): Boolean {
        if (due == null) return false
        return try {
            if (due == "today") return true
            val dueDate = due.substring(0, 10)
            dueDate <= today
        } catch (error: Throwable) {
            false
        }
    }
}
