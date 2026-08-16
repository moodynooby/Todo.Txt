package net.todotxt.app.plugins.exactalarms

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

/**
 * Tiny SQLite store for pending alarms.
 *
 * Kept deliberately dependency-free (no Room) to avoid adding Gradle
 * dependencies to the generated Android module. The schema holds at most a
 * few dozen rows — one per active reminder — so raw SQLite is ample.
 */
internal class PendingAlarmStore(context: Context) {

    private val helper = StoreDbHelper(context)

    fun all(): List<AlarmRecord> =
        helper.readableDatabase.use { db ->
            db.query(
                TABLE,
                COLUMNS,
                null, null, null, null, null,
            ).use { cursor ->
                val out = ArrayList<AlarmRecord>(cursor.count)
                while (cursor.moveToNext()) out += cursor.toRecord()
                out
            }
        }

    fun find(id: String): AlarmRecord? =
        helper.readableDatabase.use { db ->
            db.query(
                TABLE, COLUMNS, "id = ?", arrayOf(id), null, null, null,
            ).use { cursor ->
                if (cursor.moveToFirst()) cursor.toRecord() else null
            }
        }

    fun upsert(record: AlarmRecord) {
        val values = ContentValues().apply {
            put("id", record.id)
            put("epochMs", record.epochMs)
            put("title", record.title)
            put("body", record.body)
            put("repeatDaily", if (record.repeatDaily) 1 else 0)
            put("repeatIntervalMs", record.repeatIntervalMs)
            put("channelId", record.channelId)
        }
        helper.writableDatabase.use { db ->
            db.insertWithOnConflict(TABLE, null, values, SQLiteDatabase.CONFLICT_REPLACE)
        }
    }

    fun delete(id: String) {
        helper.writableDatabase.use { db ->
            db.delete(TABLE, "id = ?", arrayOf(id))
        }
    }

    private fun android.database.Cursor.toRecord(): AlarmRecord =
        AlarmRecord(
            id = getString(0),
            epochMs = getLong(1),
            title = getString(2) ?: "",
            body = getString(3) ?: "",
            repeatDaily = getInt(4) != 0,
            repeatIntervalMs = if (isNull(5)) null else getLong(5),
            channelId = getString(6) ?: "habits",
        )

    companion object {
        private const val TABLE = "pending_alarms"
        private val COLUMNS = arrayOf(
            "id", "epochMs", "title", "body", "repeatDaily",
            "repeatIntervalMs", "channelId",
        )
    }

    private class StoreDbHelper(context: Context) :
        SQLiteOpenHelper(context, "pending_alarms.db", null, 1) {

        override fun onCreate(db: SQLiteDatabase) {
            db.execSQL(
                """
                CREATE TABLE pending_alarms (
                    id TEXT PRIMARY KEY,
                    epochMs INTEGER NOT NULL,
                    title TEXT NOT NULL DEFAULT '',
                    body TEXT NOT NULL DEFAULT '',
                    repeatDaily INTEGER NOT NULL DEFAULT 0,
                    repeatIntervalMs INTEGER,
                    channelId TEXT NOT NULL DEFAULT 'habits'
                )
                """.trimIndent(),
            )
        }

        override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
            // Single-version schema; migrations not needed yet.
            db.execSQL("DROP TABLE IF EXISTS pending_alarms")
            onCreate(db)
        }
    }
}
