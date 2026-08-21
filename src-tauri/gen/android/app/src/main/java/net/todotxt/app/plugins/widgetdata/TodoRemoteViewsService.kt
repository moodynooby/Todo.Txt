package net.todotxt.app.plugins.widgetdata

import android.appwidget.AppWidgetManager
import android.content.Context
import android.content.Intent
import android.graphics.Paint
import android.os.Build
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import net.todotxt.app.R
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Collection adapter for the Today widget.
 *
 * Each row binds an open task due today / overdue with an interactive
 * checkbox whose `PendingIntent` fill-in intent queues a mark-done action
 * into the same pipeline the notification buttons use. Android 12+ gets a
 * responsive compound button (`setOnCheckedChangeResponse`); older API
 * levels fall back to a simple row click.
 */
class TodoRemoteViewsService : RemoteViewsService() {

    override fun onGetViewFactory(intent: Intent): RemoteViewsFactory =
        TodoViewsFactory(applicationContext)
}

internal class TodoViewsFactory(
    private val context: Context,
) : RemoteViewsService.RemoteViewsFactory {

    private var tasks: List<WidgetTask> = emptyList()

    override fun onCreate() = reload()

    override fun onDataSetChanged() = reload()

    private fun reload() {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        val today = sdf.format(Date())
        tasks = WidgetDataStore(context).read().tasks.filter { task ->
            !task.done && task.due != null && isDue(task.due, today)
        }
    }

    private fun isDue(due: String?, today: String): Boolean {
        return try {
            if (due == "today") true
            else (due?.substring(0, 10) ?: return false) <= today
        } catch (error: Throwable) {
            false
        }
    }

    override fun getCount(): Int = tasks.size

    override fun getViewAt(position: Int): RemoteViews {
        val task = tasks.getOrNull(position) ?: return RemoteViews(context.packageName, R.layout.widget_todo_row)
        val views = RemoteViews(context.packageName, R.layout.widget_todo_row)

        views.setTextViewText(R.id.task_text, task.text.trim().take(120))
        if (!task.due.isNullOrBlank()) {
            views.setTextViewText(R.id.task_due, task.due)
            views.setViewVisibility(R.id.task_due, android.view.View.VISIBLE)
        }

        if (task.done) {
            views.setInt(
                R.id.task_text,
                "setPaintFlags",
                Paint.STRIKE_THRU_TEXT_FLAG,
            )
        }

        val doneIntent = WidgetHelpers.markDoneIntent(context, task.id)

        if (Build.VERSION.SDK_INT >= 31) {
            // Android 12+: the OS applies the checked state instantly and
            // fires the response intent without launching the app.
            views.setOnCheckedChangeResponse(
                R.id.task_done,
                RemoteViews.RemoteResponse.fromPendingIntent(doneIntent),
            )
        } else {
            views.setOnClickFillInIntent(R.id.task_done, WidgetHelpers.markDoneFillInIntent(task.id))
            // Fallback: tapping anywhere on the row marks it done.
            views.setOnClickFillInIntent(R.id.task_text, WidgetHelpers.markDoneFillInIntent(task.id))
        }
        return views
    }

    override fun getLoadingView(): RemoteViews? = null

    override fun getViewTypeCount(): Int = 1

    override fun getItemId(position: Int): Long =
        tasks.getOrNull(position)?.id ?: position.toLong()

    override fun hasStableIds(): Boolean = true

    override fun onDestroy() {}
}
