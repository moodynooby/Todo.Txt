package app.todotxt.ui.draw

import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.put
import kotlin.math.abs
import kotlin.math.atan2
import kotlin.random.Random

/**
 * Lenient model over the `.excalidraw` v2 JSON format — the shared drawing
 * contract with the web app's Excalidraw editor.
 *
 * Design (mirrors excalidraw's own `restore.ts` contract):
 *  - the scene root is kept AS PARSED, so fields this app doesn't model
 *    (images, frames, bindings, appState, customData) survive a native edit
 *    untouched — round-trip is lossless;
 *  - rendering and editing read/write a SUBSET of element properties
 *    (rectangle, ellipse, diamond, line, arrow, freedraw, text) with every
 *    missing key defaulted, so hand-written or third-party scenes load fine.
 */
class ExcalidrawScene private constructor(private val root: JsonObject) {

    val elements: List<JsonObject>
        get() = (root["elements"] as? JsonArray)
            ?.mapNotNull { it as? JsonObject }
            ?: emptyList()

    /** Elements that should render (soft-deleted ones stay in the file). */
    val visibleElements: List<JsonObject>
        get() = elements.filter { ExEl.isDeleted(it) != true }

    fun serialize(): String = root.toString()

    /** New scene with `elements` replaced; everything else preserved. */
    fun withElements(newElements: List<JsonObject>): ExcalidrawScene {
        val updated = newElements.map { el ->
            buildJsonObject {
                el.forEach { (k, v) -> put(k, v) }
                if (el["updated"] == null) put("updated", app.todotxt.platform.nowMillis())
            }
        }
        val rebuilt = buildJsonObject {
            root.forEach { (k, v) -> put(k, v) }
            put(
                "elements",
                buildJsonArray { updated.forEach { add(it) } },
            )
        }
        return ExcalidrawScene(rebuilt)
    }

    companion object {
        private val lenient = Json { ignoreUnknownKeys = true }

        fun parse(raw: String?): ExcalidrawScene {
            if (raw.isNullOrBlank()) return empty()
            return runCatching {
                ExcalidrawScene(lenient.parseToJsonElement(raw).jsonObject)
            }.getOrElse { empty() }
        }

        fun empty(): ExcalidrawScene = ExcalidrawScene(
            buildJsonObject {
                put("type", "excalidraw")
                put("version", 2)
                put("source", "app.todotxt")
                put("elements", buildJsonArray {})
                put("appState", buildJsonObject {
                    put("viewBackgroundColor", "#ffffff")
                    put("gridSize", JsonNull)
                })
            },
        )
    }
}

// ---------------------------------------------------------------------------
// Element accessors — every getter defaults like restore.ts does.
// ---------------------------------------------------------------------------

object ExEl {
    fun type(el: JsonObject): String = str(el, "type")
    fun id(el: JsonObject): String = str(el, "id")
    fun x(el: JsonObject): Float = num(el, "x")
    fun y(el: JsonObject): Float = num(el, "y")
    fun width(el: JsonObject): Float = num(el, "width")
    fun height(el: JsonObject): Float = num(el, "height")
    fun strokeColor(el: JsonObject): String = str(el, "strokeColor", "#1e1e1e")
    fun backgroundColor(el: JsonObject): String = str(el, "backgroundColor", "transparent")
    fun strokeWidth(el: JsonObject): Float = num(el, "strokeWidth", 2f)
    fun opacity(el: JsonObject): Int = num(el, "opacity", 100f).toInt()
    fun fontSize(el: JsonObject): Float = num(el, "fontSize", 20f)
    fun text(el: JsonObject): String = str(el, "text")
    fun isDeleted(el: JsonObject): Boolean = bool(el, "isDeleted") ?: false

    fun isRenderable(el: JsonObject): Boolean =
        type(el) in RENDERABLE_TYPES

    /** Linear/freedraw points are LOCAL offsets from the element origin. */
    fun points(el: JsonObject): List<Pair<Float, Float>> {
        val array = el["points"] as? JsonArray ?: return emptyList()
        return array.mapNotNull { p ->
            val pair = p as? JsonArray ?: return@mapNotNull null
            val px = (pair.getOrNull(0) as? JsonPrimitive)?.content?.toFloatOrNull() ?: 0f
            val py = (pair.getOrNull(1) as? JsonPrimitive)?.content?.toFloatOrNull() ?: 0f
            px to py
        }
    }

    private val RENDERABLE_TYPES = setOf(
        "rectangle", "ellipse", "diamond", "line", "arrow", "freedraw", "text",
    )

    fun str(el: JsonObject, key: String, default: String = ""): String =
        (el[key] as? JsonPrimitive)?.takeIf { it !is JsonNull }?.content ?: default

    fun num(el: JsonObject, key: String, default: Float = 0f): Float =
        (el[key] as? JsonPrimitive)?.content?.toFloatOrNull() ?: default

    fun bool(el: JsonObject, key: String): Boolean? =
        (el[key] as? JsonPrimitive)?.content?.toBooleanStrictOrNull()
}

// ---------------------------------------------------------------------------
// Element factory — produces complete, spec-conformant elements.
// ---------------------------------------------------------------------------

object ExFactory {
    private fun base(
        type: String,
        x: Float,
        y: Float,
        width: Float,
        height: Float,
        strokeColor: String,
        strokeWidth: Float,
    ): JsonObject = buildJsonObject {
        put("id", randomId())
        put("type", type)
        put("x", x)
        put("y", y)
        put("width", width)
        put("height", height)
        put("angle", 0f)
        put("strokeColor", strokeColor)
        put("backgroundColor", "transparent")
        put("fillStyle", "solid")
        put("strokeWidth", strokeWidth)
        put("strokeStyle", "solid")
        put("roughness", 1)
        put("opacity", 100)
        put("seed", Random.nextInt(1, Int.MAX_VALUE))
        put("version", 1)
        put("versionNonce", Random.nextInt(1, Int.MAX_VALUE))
        put("isDeleted", false)
        put("groupIds", buildJsonArray {})
        put("frameId", JsonNull)
        put("boundElements", JsonNull)
        put("updated", app.todotxt.platform.nowMillis())
        put("link", JsonNull)
        put("locked", false)
    }

    fun shape(
        type: String,
        x: Float,
        y: Float,
        width: Float,
        height: Float,
        strokeColor: String,
        strokeWidth: Float,
    ): JsonObject = base(type, x, y, width, height, strokeColor, strokeWidth)

    /** line/arrow/freedraw: points stored LOCAL to (x, y), per the spec. */
    fun linear(
        type: String,
        absolutePoints: List<Pair<Float, Float>>,
        strokeColor: String,
        strokeWidth: Float,
    ): JsonObject {
        val minX = absolutePoints.minOf { it.first }
        val minY = absolutePoints.minOf { it.second }
        val maxX = absolutePoints.maxOf { it.first }
        val maxY = absolutePoints.maxOf { it.second }
        val el = base(
            type, minX, minY,
            maxOf(abs(maxX - minX), 1f),
            maxOf(abs(maxY - minY), 1f),
            strokeColor, strokeWidth,
        )
        val local = buildJsonArray {
            absolutePoints.forEach { (ax, ay) ->
                add(buildJsonArray {
                    add(JsonPrimitive(ax - minX))
                    add(JsonPrimitive(ay - minY))
                })
            }
        }
        return buildJsonObject {
            el.forEach { (k, v) -> put(k, v) }
            put("points", local)
            if (type == "freedraw") {
                put("pressures", buildJsonArray {})
                put("simulatePressure", true)
            } else {
                put("startBinding", JsonNull)
                put("endBinding", JsonNull)
                put("startArrowhead", JsonNull)
                put("endArrowhead", if (type == "arrow") JsonPrimitive("arrow") else JsonNull)
            }
            put("lastCommittedPoint", JsonNull)
        }
    }

    fun text(
        x: Float,
        y: Float,
        value: String,
        strokeColor: String,
        fontSize: Float = 20f,
    ): JsonObject {
        val lines = value.lines()
        val lineHeight = fontSize * 1.25f
        val width = lines.maxOf { it.length } * fontSize * 0.6f
        val el = base("text", x, y, width, lineHeight * lines.size, strokeColor, 1f)
        return buildJsonObject {
            el.forEach { (k, v) -> put(k, v) }
            put("fontSize", fontSize)
            put("fontFamily", 1)
            put("text", value)
            put("textAlign", "left")
            put("verticalAlign", "top")
            put("containerId", JsonNull)
            put("originalText", value)
            put("autoResize", true)
            put("lineHeight", 1.25)
        }
    }

    /** Translate an element by (dx, dy) — used by the select/move tool. */
    fun translate(el: JsonObject, dx: Float, dy: Float): JsonObject =
        buildJsonObject {
            el.forEach { (k, v) -> put(k, v) }
            put("x", ExEl.x(el) + dx)
            put("y", ExEl.y(el) + dy)
            put("version", (ExEl.num(el, "version", 1f)).toInt() + 1)
        }

    /** Soft delete — keeps the element in the file, per the spec. */
    fun deleted(el: JsonObject): JsonObject = buildJsonObject {
        el.forEach { (k, v) -> put(k, v) }
        put("isDeleted", true)
        put("version", ExEl.num(el, "version", 1f).toInt() + 1)
    }

    private fun randomId(): String {
        val chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
        return buildString { repeat(16) { append(chars[Random.nextInt(chars.length)]) } }
    }
}

/** Bounding box of the visible scene, for fit-to-view. */
data class ExBounds(val minX: Float, val minY: Float, val maxX: Float, val maxY: Float) {
    companion object {
        fun of(elements: List<JsonObject>): ExBounds? {
            var minX = Float.MAX_VALUE; var minY = Float.MAX_VALUE
            var maxX = -Float.MAX_VALUE; var maxY = -Float.MAX_VALUE
            var any = false
            for (el in elements) {
                if (!ExEl.isRenderable(el)) continue
                any = true
                val x1 = ExEl.x(el); val y1 = ExEl.y(el)
                val x2 = x1 + maxOf(ExEl.width(el), 1f)
                val y2 = y1 + maxOf(ExEl.height(el), 1f)
                minX = minOf(minX, x1); minY = minOf(minY, y1)
                maxX = maxOf(maxX, x2); maxY = maxOf(maxY, y2)
            }
            if (!any) return null
            // Padding so strokes at the edge stay visible.
            val pad = 24f
            return ExBounds(minX - pad, minY - pad, maxX + pad, maxY + pad)
        }
    }
}

/** Absolute (scene-space) points of a linear/freedraw element. */
fun absolutePoints(el: JsonObject): List<Pair<Float, Float>> {
    val ox = ExEl.x(el); val oy = ExEl.y(el)
    return ExEl.points(el).map { (px, py) -> (ox + px) to (oy + py) }
}

/** Arrowhead geometry helper shared by the renderer. */
fun arrowHead(
    from: Pair<Float, Float>,
    to: Pair<Float, Float>,
    strokeWidth: Float,
): List<Pair<Float, Float>> {
    val angle = atan2(to.second - from.second, to.first - from.first)
    val head = strokeWidth * 6f
    return listOf(
        (to.first - head * kotlin.math.cos(angle - 0.5f)) to
            (to.second - head * kotlin.math.sin(angle - 0.5f)),
        (to.first - head * kotlin.math.cos(angle + 0.5f)) to
            (to.second - head * kotlin.math.sin(angle + 0.5f)),
    )
}

/** Distance from point p to element bbox — hit test for the select tool. */
fun hitTest(el: JsonObject, px: Float, py: Float): Boolean {
    val x1 = ExEl.x(el); val y1 = ExEl.y(el)
    val x2 = x1 + maxOf(ExEl.width(el), 8f)
    val y2 = y1 + maxOf(ExEl.height(el), 8f)
    val pad = 8f
    return px >= x1 - pad && px <= x2 + pad && py >= y1 - pad && py <= y2 + pad
}
