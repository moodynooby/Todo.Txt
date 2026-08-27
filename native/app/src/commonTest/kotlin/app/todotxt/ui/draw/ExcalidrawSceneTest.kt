package app.todotxt.ui.draw

import kotlin.test.Test
import kotlin.test.assertTrue

class ExcalidrawSceneTest {
    @Test
    fun unknownSceneDataSurvivesNativeEdit() {
        val scene = ExcalidrawScene.parse(
            """{"type":"excalidraw","version":2,"elements":[{"id":"remote-image","type":"image","x":2,"y":3,"width":10,"height":10,"customData":{"owner":"web"}}],"appState":{"viewBackgroundColor":"#fdfdfd"},"customData":{"document":"keep"}}""",
        )
        val updated = scene.withElements(
            scene.elements + ExFactory.shape("rectangle", 10f, 10f, 20f, 20f, "#1e1e1e", 2f),
        ).serialize()

        assertTrue(updated.contains("remote-image"))
        assertTrue(updated.contains("customData"))
        assertTrue(updated.contains("viewBackgroundColor"))
        assertTrue(updated.contains("rectangle"))
    }
}
