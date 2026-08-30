@file:OptIn(ExperimentalUuidApi::class)

package app.todotxt.ui.draw

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import io.ak1.drawbox.domain.model.Element
import io.ak1.drawbox.domain.model.Element.PathSample
import io.ak1.drawbox.domain.model.ShapeType
import io.ak1.drawbox.domain.model.State
import io.ak1.drawbox.domain.model.TextAlignment
import io.ak1.drawbox.domain.model.StrokeStyle
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlin.math.abs
import kotlin.random.Random
import kotlin.uuid.ExperimentalUuidApi

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

/** Excalidraw hex string (e.g. "#1e1e1e") → Compose [Color]. */
fun excalidrawToDrawBoxColor(hex: String): Color = parseExColor(hex, Color.Black)

/** Compose [Color] → Excalidraw hex string. Alpha channel is ignored. */
fun drawBoxToExcalidrawColor(color: Color): String {
    val r = (color.red * 255).toInt().coerceIn(0, 255)
    val g = (color.green * 255).toInt().coerceIn(0, 255)
    val b = (color.blue * 255).toInt().coerceIn(0, 255)
    return buildString(7) {
        append('#')
        append(r.toString(16).padStart(2, '0'))
        append(g.toString(16).padStart(2, '0'))
        append(b.toString(16).padStart(2, '0'))
    }
}

// ---------------------------------------------------------------------------
// Opacity helpers
// ---------------------------------------------------------------------------

/** DrawBox alpha (0.0–1.0) → Excalidraw opacity integer (0–100). */
fun excalidrawOpacityToInt(alpha: Float): Int = (alpha * 100).toInt().coerceIn(0, 100)

/** Excalidraw opacity integer (0–100) → DrawBox alpha (0.0–1.0). */
fun drawBoxOpacityToFloat(opacity: Int): Float = (opacity / 100f).coerceIn(0f, 1f)

// ---------------------------------------------------------------------------
// StrokeStyle mapping
// ---------------------------------------------------------------------------

private fun drawboxStrokeStyle(exStyle: String): StrokeStyle = when (exStyle) {
    "dashed" -> StrokeStyle.DASHED
    "dotted" -> StrokeStyle.DOTTED
    else -> StrokeStyle.SOLID
}

private fun excalidrawStrokeStyle(style: StrokeStyle): String = when (style) {
    StrokeStyle.DASHED -> "dashed"
    StrokeStyle.DOTTED -> "dotted"
    else -> "solid"
}

// ---------------------------------------------------------------------------
// TextAlignment mapping
// ---------------------------------------------------------------------------

private fun drawboxTextAlignment(align: String): TextAlignment = when (align) {
    "center" -> TextAlignment.CENTER
    "right" -> TextAlignment.RIGHT
    else -> TextAlignment.LEFT
}

private fun excalidrawTextAlign(align: TextAlignment): String = when (align) {
    TextAlignment.CENTER -> "center"
    TextAlignment.RIGHT -> "right"
    else -> "left"
}

// ---------------------------------------------------------------------------
// Font-family mapping
// ---------------------------------------------------------------------------

private fun drawboxFontFamilyKey(fontFamily: Int): String = when (fontFamily) {
    3 -> "mono"
    else -> "sans"
}

private fun excalidrawFontFamily(key: String): Int = when (key) {
    "mono" -> 3
    else -> 1
}

// ---------------------------------------------------------------------------
// Background color helper
// ---------------------------------------------------------------------------

private fun drawboxFillColor(bgHex: String): Color? {
    if (bgHex == "transparent" || bgHex.isBlank()) return null
    return parseExColor(bgHex, Color.Black)
}

// ===========================================================================
// toDrawBox — Excalidraw scene → DrawBox State
// ===========================================================================

/**
 * Convert an [ExcalidrawScene] into a DrawBox [State].
 *
 * Renderable elements are mapped by type; non-renderable elements (images,
 * frames, bindings) are silently dropped since DrawBox has no equivalent.
 * Unknown fields in the Excalidraw JSON survive in [scene] but are not
 * transferred to DrawBox [Element] properties.
 */
fun toDrawBox(scene: ExcalidrawScene): State {
    var zIndex = 0
    val elements = mutableListOf<Element>()

    for (el in scene.elements) {
        if (!ExEl.isRenderable(el)) continue
        if (ExEl.isDeleted(el)) continue

        val z = zIndex++
        when (ExEl.type(el)) {
            "rectangle" -> elements.add(excalidrawRectangleToShape(el, z))
            "ellipse" -> elements.add(excalidrawEllipseToShape(el, z))
            "diamond" -> elements.add(excalidrawDiamondToPath(el, z))
            "line" -> elements.add(excalidrawLineToShape(el, z))
            "arrow" -> elements.add(excalidrawArrowToShape(el, z))
            "freedraw" -> elements.add(excalidrawFreedrawToPath(el, z))
            "text" -> elements.add(excalidrawTextToText(el, z))
        }
    }

    return State(elements = elements)
}

// --- Individual element converters: Excalidraw → DrawBox ---

private fun excalidrawRectangleToShape(el: JsonObject, z: Int): Element.Shape {
    val x = ExEl.x(el); val y = ExEl.y(el)
    val w = ExEl.width(el); val h = ExEl.height(el)
    val alpha = drawBoxOpacityToFloat(ExEl.opacity(el))
    return Element.Shape(
        id = ExEl.id(el),
        shapeType = ShapeType.RECTANGLE,
        points = listOf(Offset(x, y), Offset(x + w, y + h)),
        strokeColor = excalidrawToDrawBoxColor(ExEl.strokeColor(el)).copy(alpha = alpha),
        fillColor = drawboxFillColor(ExEl.backgroundColor(el))?.copy(alpha = alpha),
        strokeWidth = ExEl.strokeWidth(el),
        zIndex = z,
        strokeStyle = drawboxStrokeStyle(ExEl.str(el, "strokeStyle", "solid")),
    )
}

private fun excalidrawEllipseToShape(el: JsonObject, z: Int): Element.Shape {
    val x = ExEl.x(el); val y = ExEl.y(el)
    val w = ExEl.width(el); val h = ExEl.height(el)
    val alpha = drawBoxOpacityToFloat(ExEl.opacity(el))
    return Element.Shape(
        id = ExEl.id(el),
        shapeType = ShapeType.CIRCLE,
        points = listOf(Offset(x, y), Offset(x + w, y + h)),
        strokeColor = excalidrawToDrawBoxColor(ExEl.strokeColor(el)).copy(alpha = alpha),
        fillColor = drawboxFillColor(ExEl.backgroundColor(el))?.copy(alpha = alpha),
        strokeWidth = ExEl.strokeWidth(el),
        zIndex = z,
        strokeStyle = drawboxStrokeStyle(ExEl.str(el, "strokeStyle", "solid")),
    )
}

/**
 * Diamond becomes a 4-point [Element.Path] whose samples trace the
 * diamond vertices: top → right → bottom → left.
 */
private fun excalidrawDiamondToPath(el: JsonObject, z: Int): Element.Path {
    val x = ExEl.x(el); val y = ExEl.y(el)
    val w = ExEl.width(el); val h = ExEl.height(el)
    val cx = x + w / 2f
    val cy = y + h / 2f
    val sw = ExEl.strokeWidth(el)
    return Element.Path(
        id = ExEl.id(el),
        samples = listOf(
            PathSample(Offset(cx, y), sw),
            PathSample(Offset(x + w, cy), sw),
            PathSample(Offset(cx, y + h), sw),
            PathSample(Offset(x, cy), sw),
        ),
        strokeColor = excalidrawToDrawBoxColor(ExEl.strokeColor(el)),
        strokeWidth = sw,
        alpha = drawBoxOpacityToFloat(ExEl.opacity(el)),
        zIndex = z,
        strokeStyle = drawboxStrokeStyle(ExEl.str(el, "strokeStyle", "solid")),
    )
}

private fun excalidrawLineToShape(el: JsonObject, z: Int): Element.Shape {
    val pts = absolutePoints(el)
    val start = pts.firstOrNull()?.let { (x, y) -> Offset(x, y) } ?: Offset(ExEl.x(el), ExEl.y(el))
    val end = pts.lastOrNull()?.let { (x, y) -> Offset(x, y) } ?: start
    val alpha = drawBoxOpacityToFloat(ExEl.opacity(el))
    return Element.Shape(
        id = ExEl.id(el),
        shapeType = ShapeType.LINE,
        points = listOf(start, end),
        strokeColor = excalidrawToDrawBoxColor(ExEl.strokeColor(el)).copy(alpha = alpha),
        strokeWidth = ExEl.strokeWidth(el),
        zIndex = z,
        strokeStyle = drawboxStrokeStyle(ExEl.str(el, "strokeStyle", "solid")),
    )
}

private fun excalidrawArrowToShape(el: JsonObject, z: Int): Element.Shape {
    val pts = absolutePoints(el)
    val start = pts.firstOrNull()?.let { (x, y) -> Offset(x, y) } ?: Offset(ExEl.x(el), ExEl.y(el))
    val end = pts.lastOrNull()?.let { (x, y) -> Offset(x, y) } ?: start
    val alpha = drawBoxOpacityToFloat(ExEl.opacity(el))
    return Element.Shape(
        id = ExEl.id(el),
        shapeType = ShapeType.ARROW,
        points = listOf(start, end),
        strokeColor = excalidrawToDrawBoxColor(ExEl.strokeColor(el)).copy(alpha = alpha),
        strokeWidth = ExEl.strokeWidth(el),
        zIndex = z,
        strokeStyle = drawboxStrokeStyle(ExEl.str(el, "strokeStyle", "solid")),
    )
}

private fun excalidrawFreedrawToPath(el: JsonObject, z: Int): Element.Path {
    val pts = absolutePoints(el)
    val sw = ExEl.strokeWidth(el)
    return Element.Path(
        id = ExEl.id(el),
        samples = pts.map { (px, py) -> PathSample(Offset(px, py), sw) },
        strokeColor = excalidrawToDrawBoxColor(ExEl.strokeColor(el)),
        strokeWidth = sw,
        alpha = drawBoxOpacityToFloat(ExEl.opacity(el)),
        zIndex = z,
        strokeStyle = drawboxStrokeStyle(ExEl.str(el, "strokeStyle", "solid")),
    )
}

private fun excalidrawTextToText(el: JsonObject, z: Int): Element.Text {
    val x = ExEl.x(el); val y = ExEl.y(el)
    val w = ExEl.width(el); val h = ExEl.height(el)
    return Element.Text(
        id = ExEl.id(el),
        text = ExEl.text(el),
        fontFamilyKey = drawboxFontFamilyKey(ExEl.num(el, "fontFamily", 1f).toInt()),
        fontSize = ExEl.fontSize(el),
        color = excalidrawToDrawBoxColor(ExEl.strokeColor(el)),
        alignment = drawboxTextAlignment(ExEl.str(el, "textAlign", "left")),
        topLeft = Offset(x, y),
        wrapWidth = w.coerceAtLeast(1f),
        measuredHeight = h.coerceAtLeast(ExEl.fontSize(el)),
        opacity = drawBoxOpacityToFloat(ExEl.opacity(el)),
        zIndex = z,
    )
}

// ===========================================================================
// toExcalidraw — DrawBox State + base scene → Excalidraw scene
// ===========================================================================

/**
 * Convert a DrawBox [State] back into an [ExcalidrawScene].
 *
 * Renderable DrawBox elements are converted to Excalidraw JSON elements.
 * Non-renderable elements from [base] (images, frames, bindings) are
 * preserved verbatim. Top-level root keys (type, version, source, appState,
 * customData, files, gridSize) are inherited from [base] via
 * [ExcalidrawScene.withElements].
 */
fun toExcalidraw(state: State, base: ExcalidrawScene): ExcalidrawScene {
    val converted = state.elements.mapNotNull { element ->
        when (element) {
            is Element.Path -> drawboxPathToExcalidraw(element)
            is Element.Shape -> drawboxShapeToExcalidraw(element)
            is Element.Text -> drawboxTextToExcalidraw(element)
            is Element.Image -> null // not convertible; preserved via base
        }
    }
    val preserved = base.elements.filter { !ExEl.isRenderable(it) }
    return base.withElements(converted + preserved)
}

// --- Individual element converters: DrawBox → Excalidraw ---

private fun drawboxShapeToExcalidraw(shape: Element.Shape): JsonObject {
    val strokeHex = drawBoxToExcalidrawColor(shape.strokeColor)
    val bgHex = shape.fillColor?.let { drawBoxToExcalidrawColor(it) } ?: "transparent"
    val opacityInt = excalidrawOpacityToInt(shape.strokeColor.alpha)
    val ss = excalidrawStrokeStyle(shape.strokeStyle)

    return when (shape.shapeType) {
        ShapeType.RECTANGLE, ShapeType.TRIANGLE -> {
            // No native Excalidraw TRIANGLE; approximate as rectangle.
            val (x, y, w, h) = shapeAabb(shape.points)
            buildExcalidrawElement(shape.id, "rectangle", x, y, w, h, strokeHex, bgHex, shape.strokeWidth, opacityInt, ss)
        }
        ShapeType.CIRCLE -> {
            val (x, y, w, h) = shapeAabb(shape.points)
            buildExcalidrawElement(shape.id, "ellipse", x, y, w, h, strokeHex, bgHex, shape.strokeWidth, opacityInt, ss)
        }
        ShapeType.LINE -> {
            val start = shape.points.getOrElse(0) { Offset.Zero }
            val end = shape.points.getOrElse(1) { start }
            ExFactory.linear("line", listOf(start.x to start.y, end.x to end.y), strokeHex, shape.strokeWidth)
                .let { base -> baseWithOverrides(base, opacityInt, ss, bgHex) }
        }
        ShapeType.ARROW -> {
            val start = shape.points.getOrElse(0) { Offset.Zero }
            val end = shape.points.getOrElse(1) { start }
            ExFactory.linear("arrow", listOf(start.x to start.y, end.x to end.y), strokeHex, shape.strokeWidth)
                .let { base -> baseWithOverrides(base, opacityInt, ss, bgHex) }
        }
    }
}

private fun drawboxPathToExcalidraw(path: Element.Path): JsonObject {
    val strokeHex = drawBoxToExcalidrawColor(path.strokeColor)
    val opacityInt = excalidrawOpacityToInt(path.alpha)
    val ss = excalidrawStrokeStyle(path.strokeStyle)
    val pts = path.samples.map { it.position.x to it.position.y }

    // Heuristic: 4 points at diamond midpoints → diamond element.
    if (pts.size == 4 && looksLikeDiamond(pts)) {
        val xs = pts.map { it.first }; val ys = pts.map { it.second }
        val x = xs.min(); val y = ys.min()
        val w = maxOf(xs.max() - x, 1f); val h = maxOf(ys.max() - y, 1f)
        return buildExcalidrawElement(path.id, "diamond", x, y, w, h, strokeHex, "transparent", path.strokeWidth, opacityInt, ss)
    }

    // Freedraw: store absolute points as local offsets from the element origin.
    val minX = pts.minOfOrNull { it.first } ?: 0f
    val minY = pts.minOfOrNull { it.second } ?: 0f
    val maxX = pts.maxOfOrNull { it.first } ?: 0f
    val maxY = pts.maxOfOrNull { it.second } ?: 0f
    val w = maxOf(maxX - minX, 1f)
    val h = maxOf(maxY - minY, 1f)

    return buildJsonObject {
        put("id", path.id)
        put("type", "freedraw")
        put("x", minX)
        put("y", minY)
        put("width", w)
        put("height", h)
        put("angle", 0f)
        put("strokeColor", strokeHex)
        put("backgroundColor", "transparent")
        put("fillStyle", "solid")
        put("strokeWidth", path.strokeWidth)
        put("strokeStyle", ss)
        put("roughness", 1)
        put("opacity", opacityInt)
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
        put("points", buildJsonArray {
            pts.forEach { (px, py) ->
                add(buildJsonArray {
                    add(JsonPrimitive(px - minX))
                    add(JsonPrimitive(py - minY))
                })
            }
        })
        put("pressures", buildJsonArray {})
        put("simulatePressure", true)
        put("lastCommittedPoint", JsonNull)
    }
}

private fun drawboxTextToExcalidraw(text: Element.Text): JsonObject {
    val colorHex = drawBoxToExcalidrawColor(text.color)
    val opacityInt = excalidrawOpacityToInt(text.opacity)
    val textAlignStr = excalidrawTextAlign(text.alignment)
    val fontFamilyInt = excalidrawFontFamily(text.fontFamilyKey)
    val lines = text.text.lines()
    val lineHeight = text.fontSize * 1.25f
    val measuredW = lines.maxOfOrNull { it.length }?.times(text.fontSize * 0.6f) ?: text.wrapWidth
    val measuredH = lineHeight * lines.size

    return buildJsonObject {
        put("id", text.id)
        put("type", "text")
        put("x", text.topLeft.x)
        put("y", text.topLeft.y)
        put("width", measuredW)
        put("height", measuredH)
        put("angle", 0f)
        put("strokeColor", colorHex)
        put("backgroundColor", "transparent")
        put("fillStyle", "solid")
        put("strokeWidth", 1f)
        put("strokeStyle", "solid")
        put("roughness", 1)
        put("opacity", opacityInt)
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
        put("fontSize", text.fontSize)
        put("fontFamily", fontFamilyInt)
        put("text", text.text)
        put("textAlign", textAlignStr)
        put("verticalAlign", "top")
        put("containerId", JsonNull)
        put("originalText", text.text)
        put("autoResize", true)
        put("lineHeight", 1.25)
    }
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Axis-aligned bounding box of a two-point [Shape.points] list. */
private fun shapeAabb(points: List<Offset>): Quadruple<Float, Float, Float, Float> {
    val start = points.getOrElse(0) { Offset.Zero }
    val end = points.getOrElse(1) { start }
    val x = minOf(start.x, end.x); val y = minOf(start.y, end.y)
    val w = maxOf(abs(end.x - start.x), 1f)
    val h = maxOf(abs(end.y - start.y), 1f)
    return Quadruple(x, y, w, h)
}

/** Returns true when [pts] are the four midpoints of a rectangle's edges (diamond signature). */
private fun looksLikeDiamond(pts: List<Pair<Float, Float>>): Boolean {
    val xs = pts.map { it.first }; val ys = pts.map { it.second }
    val minX = xs.min(); val maxX = xs.max()
    val minY = ys.min(); val maxY = ys.max()
    val cx = (minX + maxX) / 2f
    val cy = (minY + maxY) / 2f
    return pts.all { (px, py) ->
        (abs(px - cx) < 0.5f && (abs(py - minY) < 0.5f || abs(py - maxY) < 0.5f)) ||
            (abs(py - cy) < 0.5f && (abs(px - minX) < 0.5f || abs(px - maxX) < 0.5f))
    }
}

/** Overlay opacity / strokeStyle / background onto an [ExFactory.linear] result. */
private fun baseWithOverrides(
    base: JsonObject,
    opacity: Int,
    strokeStyle: String,
    backgroundColor: String,
): JsonObject = buildJsonObject {
    base.forEach { (k, v) -> put(k, v) }
    put("opacity", opacity)
    put("strokeStyle", strokeStyle)
    put("backgroundColor", backgroundColor)
}

/** Build a complete Excalidraw shape/element JSON object. */
private fun buildExcalidrawElement(
    id: String,
    type: String,
    x: Float,
    y: Float,
    width: Float,
    height: Float,
    strokeColor: String,
    backgroundColor: String,
    strokeWidth: Float,
    opacity: Int,
    strokeStyle: String,
): JsonObject = buildJsonObject {
    put("id", id)
    put("type", type)
    put("x", x)
    put("y", y)
    put("width", width)
    put("height", height)
    put("angle", 0f)
    put("strokeColor", strokeColor)
    put("backgroundColor", backgroundColor)
    put("fillStyle", "solid")
    put("strokeWidth", strokeWidth)
    put("strokeStyle", strokeStyle)
    put("roughness", 1)
    put("opacity", opacity)
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

/** Lightweight 4-tuple for AABB results. */
private data class Quadruple<A, B, C, D>(val first: A, val second: B, val third: C, val fourth: D)
