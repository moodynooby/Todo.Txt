$(document).ready(function () {

    const welcomeText = ``;

    const darkmodeText = "Enable dark mode [Ctrl/Cmd + M]";
    const lightmodeText = "Enable light mode [Ctrl/Cmd + M]";
    const darkMetaColor = "#0d1117";
    const lightMetaColor = "#4d4d4d";
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    const {notepad, state, setState, removeState, get} = selector();
    const optimalLineLengthPadding = "15px 15vw 40px";

    const editorConfig = {
        defaultFontSize: 18,
        defaultLineHeight: 26,
        defaultFontWeight: "normal",
        defaultShowWordCountPill: "Yes",
        defaultWriteDirection: "ltr",
        defaultOptimalLineLength: false,
        defaultOptimalLineLengthPadding: "15px 24px 40px",
        defaultSpellCheck: true,
        defaultTabIndentation: false,
    };

    const themeConfig = {
        lightmodeText,
        darkmodeText,
        lightMetaColor,
        darkMetaColor,
        metaThemeColor,
    };

    const noteItem = state.note && state.note != "" ? state.note : welcomeText;
    const characterAndWordCountText = calculateCharactersAndWords(noteItem);

    notepad.wordCount.text(characterAndWordCountText);
    notepad.note.val(noteItem);

    $('[data-toggle="tooltip"]').tooltip();
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // dark mode
        setState("mode", "dark");
        document.documentElement.dataset.bsTheme = "dark";

    } else {
        document.documentElement.dataset.bsTheme = "light";
        setState("mode", "light");
    }
    if (!state.isUserPreferredTheme) {
        setState("isUserPreferredTheme", "false");
    }

    if (state.userChosenFontSize) {
        notepad.note.css("font-size", state.userChosenFontSize + "px");
        notepad.fontSize.val(state.userChosenFontSize);
    } else {
        resetFontSize(editorConfig.defaultFontSize);
    }

    if (state.userChosenFontWeight) {
        notepad.note.css("font-weight", state.userChosenFontWeight);
        notepad.fontWeight.val(state.userChosenFontWeight);
    } else {
        resetFontWeight(editorConfig.defaultFontWeight);
    }

    if (state.userChosenLineHeight) {
        notepad.note.css("line-height", state.userChosenLineHeight + "px");
        notepad.lineHeight.val(state.userChosenLineHeight);
    } else {
        resetLineHeight(editorConfig.defaultLineHeight);
    }

    const userChosenWordCountPillSelected = state.userChosenWordCountPillSelected;

    if (userChosenWordCountPillSelected) {
        userChosenWordCountPillSelected === "Yes"
            ? notepad.wordCountContainer.show()
            : notepad.wordCountContainer.hide();
        notepad.showWordCountPill.prop(
            "checked",
            userChosenWordCountPillSelected === "Yes"
        );
    } else {
        notepad.wordCountContainer.show();
        notepad.showWordCountPill.prop("checked", true);
    }

    if (state.userChosenWriteDirection) {
        notepad.note.css("direction", state.userChosenWriteDirection);
        notepad.writeDirection.val(state.userChosenWriteDirection);
    } else {
        resetWriteDirection(editorConfig.defaultWriteDirection);
    }

    if (state.isMonospaced) {
        notepad.monospaced.prop("checked", true);
        notepad.note.addClass("monospaced");
    } else {
        notepad.monospaced.prop("checked", false);
        notepad.note.removeClass("monospaced");
    }

    if (state.isDislexic) {
        notepad.dyslexic.prop("checked", true);
        notepad.note.addClass("dislexic");
    } else {
        notepad.dyslexic.prop("checked", false);
        notepad.note.removeClass("dislexic");
    }

    if (state.userChosenOptimalLineLengthSelected) {
        const textArea = document.getElementById("note");

        if (state.userChosenOptimalLineLengthSelected === "Yes") {
            textArea.style.padding = optimalLineLengthPadding;
        } else {
            textArea.style.padding = editorConfig.defaultOptimalLineLengthPadding;
        }

        notepad.optimalLineLength.prop(
            "checked",
            state.userChosenOptimalLineLengthSelected === "Yes"
        );
    } else {
        notepad.optimalLineLength.prop("checked", false);
    }

    if (state.userChosenSpellCheck) {
        if (state.userChosenSpellCheck === "Yes") {
            notepad.note.attr("spellcheck", true);
        } else {
            notepad.note.attr("spellcheck", false);
        }

        notepad.spellCheck.prop("checked", state.userChosenSpellCheck === "Yes");
    } else {
        notepad.spellCheck.prop("checked", true);
    }

    if (state.userChosenTabIndentation) {
        notepad.tabIndentation.prop(
            "checked",
            state.userChosenTabIndentation === "Yes"
        );
    } else {
        notepad.tabIndentation.prop("checked", false);
    }

    if (state.mode && state.mode === "dark") {
        enableDarkMode(lightmodeText, darkMetaColor, metaThemeColor);

        $('input[name="themes"][value="dark"]').prop("checked", true);
    } else if (state.mode && state.mode === "light") {
        enableLightMode(darkmodeText, lightMetaColor, metaThemeColor);

        $('input[name="themes"][value="light"]').prop("checked", true);
    } else {
        enableDeviceTheme(themeConfig);

        $('input[name="themes"][value="device"]').prop("checked", true);
    }

    const themeRadios = document.querySelectorAll('input[name="themes"]');

    themeRadios.forEach((radio) => {
        radio.addEventListener("change", (event) => {
            switch (event.target.value) {
                case "dark":
                    enableDarkMode(lightmodeText, darkMetaColor, metaThemeColor);
                    break;
                case "light":
                    enableLightMode(darkmodeText, lightMetaColor, metaThemeColor);
                    break;
                case "device":
                    enableDeviceTheme(themeConfig);
                    break;
            }
        });
    });

    notepad.note.keyup(
        debounce(function () {
            const characterAndWordCountText = calculateCharactersAndWords(
                get(this).val()
            );
            notepad.wordCount.text(characterAndWordCountText);
            setState("note", get(this).val());
        }, 500)
    );

    notepad.note.keydown(function (e) {
        const tabIndentation = notepad.tabIndentation.prop("checked");

        if (e.key === "Tab" && tabIndentation) {
            e.preventDefault();

            let textarea = e.target;
            let start = textarea.selectionStart;
            let end = textarea.selectionEnd;
            let tabCharacter = "\t";

            if (start === end) {
                // Single cursor position: Insert tab
                document.execCommand("insertText", false, tabCharacter);
                textarea.selectionStart = textarea.selectionEnd =
                    start + tabCharacter.length;
            } else {
                // Multi-line selection: Add tab to each line
                let value = textarea.value;
                let selectedText = value.substring(start, end);
                let lines = selectedText.split("\n");

                if (e.shiftKey) {
                    // Shift+Tab: Remove leading tab if present
                    let unindentedLines = lines.map((line) =>
                        line.startsWith(tabCharacter)
                            ? line.substring(tabCharacter.length)
                            : line
                    );
                    document.execCommand("insertText", false, unindentedLines.join("\n"));
                } else {
                    // Tab: Indent each line
                    let indentedLines = lines.map((line) => tabCharacter + line);
                    document.execCommand("insertText", false, indentedLines.join("\n"));
                }
            }
        }
    });

    notepad.clearNotes.on("click", function () {
        deleteNotes();
    });

    notepad.copyToClipboard.click(function () {
        copyNotesToClipboard(notepad.note.val());
    });

    notepad.downloadNotes.click(function (e) {
        e.stopPropagation(); // Stop click event from bubbling
        $("#iconDropdown").toggleClass("show");
        $("#moreToolsDropdown").removeClass("show");
    });

    notepad.moreTools.click(function (e) {
        e.stopPropagation(); // Stop click event from bubbling
        $("#moreToolsDropdown").toggleClass("show");
        $("#iconDropdown").removeClass("show");
    });

    notepad.downloadNotesPlain.click(function (e) {
        saveTextAsFile(note.value, getFileName());
    });

    notepad.downloadNotesPdf.click(function (e) {
        exportNotesAsPDF(note.value, getPdfFileName());
    });

    notepad.downloadNotesDocx.click(function (e) {
        const textToWrite = note.value;
        const fileNameToSaveAs = getDocxFileName();

        exportNotesAsDocx(textToWrite, fileNameToSaveAs);
    });

    notepad.downloadNotesHtml.click(function (e) {
        const textToWrite = note.value;
        const fileNameToSaveAs = getHtmlFileName();

        downloadHTML(textToWrite, fileNameToSaveAs);
    });

    // Close dropdown if clicked outside
    $(document).on("click", function () {
        $("#iconDropdown").removeClass("show");
        $("#moreToolsDropdown").removeClass("show");
    });

    notepad.fullScreenButton.click(function () {
        toggleFullScreen();
    });

    notepad.fontSize.on("change", function (e) {
        const fontSizeSelected = this.value;

        notepad.note.css("font-size", fontSizeSelected + "px");
        setState("userChosenFontSize", fontSizeSelected);
    });

    notepad.lineHeight.on("change", function (e) {
        const lineHeightSelected = this.value;

        notepad.note.css("line-height", lineHeightSelected + "px");
        setState("userChosenLineHeight", lineHeightSelected);
    });

    notepad.fontWeight.on("change", function (e) {
        const fontWeightSelected = this.value;

        notepad.note.css("font-weight", fontWeightSelected);
        setState("userChosenFontWeight", fontWeightSelected);
    });

    notepad.writeDirection.on("change", function (e) {
        const writeDirectionSelected = this.value;

        notepad.note.css("direction", writeDirectionSelected);
        setState("userChosenWriteDirection", writeDirectionSelected);
    });

    notepad.showWordCountPill.on("change", function (e) {
        if ($(this).is(":checked")) {
            notepad.wordCountContainer.show();
            setState("userChosenWordCountPillSelected", "Yes");
        } else {
            notepad.wordCountContainer.hide();
            setState("userChosenWordCountPillSelected", "No");
        }
    });

    notepad.optimalLineLength.on("change", function (e) {
        const textArea = document.getElementById("note");

        if ($(this).is(":checked")) {
            textArea.style.padding = optimalLineLengthPadding;
            setState("userChosenOptimalLineLengthSelected", "Yes");
        } else {
            textArea.style.padding = editorConfig.defaultOptimalLineLengthPadding;
            setState("userChosenOptimalLineLengthSelected", "No");
        }
    });

    notepad.spellCheck.on("change", function (e) {
        if ($(this).is(":checked")) {
            notepad.note.attr("spellcheck", true);
            setState("userChosenSpellCheck", "Yes");
        } else {
            notepad.note.attr("spellcheck", false);
            setState("userChosenSpellCheck", "No");
        }
    });

    notepad.tabIndentation.on("change", function (e) {
        if ($(this).is(":checked")) {
            setState("userChosenTabIndentation", "Yes");
        } else {
            setState("userChosenTabIndentation", "No");
        }
    });

    notepad.resetPreferences.click(function () {
        if (selector().state.userChosenFontSize) {
            removeState("userChosenFontSize");
            resetFontSize(editorConfig.defaultFontSize);
        }

        if (selector().state.userChosenLineHeight) {
            removeState("userChosenLineHeight");
            resetLineHeight(editorConfig.defaultLineHeight);
        }

        if (selector().state.userChosenFontWeight) {
            removeState("userChosenFontWeight");
            resetFontWeight(editorConfig.defaultFontWeight);
        }

        if (selector().state.userChosenWordCountPillSelected) {
            removeState("userChosenWordCountPillSelected");
            resetShowWordCountPill(editorConfig.defaultShowWordCountPill);
        }

        if (selector().state.userChosenWriteDirection) {
            removeState("userChosenWriteDirection");
            resetWriteDirection(editorConfig.defaultWriteDirection);
        }

        if (selector().state.userChosenOptimalLineLengthSelected) {
            removeState("userChosenOptimalLineLengthSelected");
            resetOptimalLineLength(
                editorConfig.defaultOptimalLineLengthPadding,
                editorConfig.defaultOptimalLineLength
            );
        }

        if (selector().state.isMonospaced) {
            removeState("monospaced");
            notepad.note.removeClass("monospaced");
            notepad.monospaced.prop("checked", false);
        }

        if (selector().state.isDyslexic) {
            removeState("dyslexicFont");
            notepad.note.removeClass("dyslexic");
            notepad.dyslexic.prop("checked", false);
        }

        if (selector().state.userChosenSpellCheck) {
            removeState("userChosenSpellCheck");
            notepad.note.attr("spellcheck", false);
            notepad.spellCheck.prop("checked", editorConfig.defaultSpellCheck);
        }

        if (selector().state.userChosenTabIndentation) {
            removeState("userChosenTabIndentation");
            notepad.tabIndentation.prop(
                "checked",
                editorConfig.defaultTabIndentation
            );
        }

        // Reset to device theme as default
        $('input[name="themes"][value="device"]').prop("checked", true);
        enableDeviceTheme(themeConfig);
    });

    notepad.monospaced.change(function () {
        if ($(this).is(":checked")) {
            notepad.note.addClass("monospaced");
            setState("monospaced", "true");
        } else {
            notepad.note.removeClass("monospaced");
            removeState("monospaced");
        }
    });

    if (navigator.share && window.self === window.top) {
        $("#shareNotesContainer").show();
    }

    notepad.shareNotes.click(function (e) {
        e.stopPropagation();
        const textToShare = note.value;
        shareNotes(textToShare);
    });

    const pipButton = document.getElementById("pip");

    // Only show the Picture-in-Picture
    // button if the browser supports it
    if ("documentPictureInPicture" in window) {
        $("#pipContainer").show();

        pipButton.addEventListener("click", async () => {
            const appTextarea = document.getElementById("textareaContainer");

            // Open a Picture-in-Picture window.
            const pipWindow = await documentPictureInPicture.requestWindow({
                width: 350,
                height: 500,
            });

            [...document.styleSheets].forEach((styleSheet) => {
                try {
                    const cssRules = [...styleSheet.cssRules]
                        .map((rule) => rule.cssText)
                        .join("");
                    const style = document.createElement("style");

                    style.textContent = cssRules;
                    pipWindow.document.head.appendChild(style);
                } catch (e) {
                    const link = document.createElement("link");

                    link.rel = "stylesheet";
                    link.type = styleSheet.type;
                    link.media = styleSheet.media;
                    link.href = styleSheet.href;
                    pipWindow.document.head.appendChild(link);
                }
            });

            // Move the textarea to the Picture-in-Picture window.
            pipWindow.document.body.append(appTextarea);

            // Move the textarea back when the Picture-in-Picture window closes.
            pipWindow.addEventListener("pagehide", (event) => {
                const mainContainer = document.querySelector("#mainContainer");
                const textareaContainer =
                    event.target.querySelector("#textareaContainer");
                const overlay = document.querySelector(".overlay");
                mainContainer.append(textareaContainer);
                mainContainer.classList.remove("pip");

                overlay.style.display = "none";
                overlay.style.pointerEvents = "none";

                textareaContainer.classList.remove("dark");
            });
        });

        documentPictureInPicture.addEventListener("enter", (event) => {
            const playerContainer = document.querySelector("#mainContainer");
            const textareaContainer = document.querySelector("#textareaContainer");
            const overlay = document.querySelector(".overlay");

            playerContainer.classList.add("pip");
            overlay.style.display = "block";
            overlay.style.pointerEvents = "all";

            if (
                localStorage.getItem("mode") &&
                localStorage.getItem("mode") == "dark"
            ) {
                textareaContainer.classList.add("dark");
            }

            if (
                localStorage.getItem("mode") &&
                localStorage.getItem("mode") == "device" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches
            ) {
                textareaContainer.classList.add("dark");
            }
        });
    }

    // This changes the application's theme when
    // user toggles device's theme preference
    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
            if (state.mode && state.mode === "device") {
                enableDeviceTheme(themeConfig);
            }
        });

    // This hides the install app button
    // if the app is already installed
    if (getPWADisplayMode() === "standalone") {
        notepad.installApp.hide();
    }

    window
        .matchMedia("(display-mode: standalone)")
        .addEventListener("change", ({matches}) => {
            if (matches) {
                notepad.installApp.hide();
            } else {
                notepad.installApp.show();
            }
        });

    // This listens for keyboard shortcuts
    document.onkeydown = function (event) {
        event = event || window.event;

        if (event.key === "Escape") {
            $(".modal").modal("hide");
            $("#iconDropdown").removeClass("show");
            $("#moreToolsDropdown").removeClass("show");
        }

        if ((event.ctrlKey || event.metaKey) && event.code === "KeyS") {
            saveTextAsFile(note.value, getFileName());
            event.preventDefault();
        }

        if (event.altKey && event.code === "KeyS") {
            exportNotesAsPDF(note.value, getPdfFileName());
            event.preventDefault();
        }

        if ((event.ctrlKey || event.metaKey) && event.code === "Comma") {
            event.preventDefault();

            if (notepad.preferencesModal.hasClass("in")) return;

            $(".modal").modal("hide");
            notepad.preferencesModal.modal("show");
        }

        if ((event.ctrlKey || event.metaKey) && event.code === "KeyK") {
            event.preventDefault();

            if (notepad.keyboardShortcutsModal.hasClass("in")) return;

            $(".modal").modal("hide");
            notepad.keyboardShortcutsModal.modal("show");
        }

        if (event.altKey && event.code === "KeyC") {
            event.preventDefault();
            copyNotesToClipboard(notepad.note.val());
        }

        if ((event.ctrlKey || event.metaKey) && event.code === "Delete") {
            event.preventDefault();
            deleteNotes();
        }

        if (event.altKey && event.code === "KeyF") {
            event.preventDefault();

            toggleFocusMode(notepad);
        }
    };

    // Get dyslexic font preference from localStorage
    const dyslexicFontEnabled = localStorage.getItem("dyslexicFont") === "true";
    const dyslexicFontCheckbox = document.getElementById("dyslexic");
    const monospacedCheckbox = document.getElementById("monospaced");

    dyslexicFontCheckbox.checked = dyslexicFontEnabled;
    if (dyslexicFontEnabled) {
        notepad.note.addClass("dyslexic");
        monospacedCheckbox.checked = false;
        notepad.note.removeClass("monospaced");
    }

    // Toggle dyslexic font
    dyslexicFontCheckbox.addEventListener("change", (e) => {
        if (e.target.checked) {
            notepad.note.addClass("dyslexic");
            monospacedCheckbox.checked = false;
            notepad.note.removeClass("monospaced");
            localStorage.setItem("monospaced", "false");
        } else {
            notepad.note.removeClass("dyslexic");
        }
        localStorage.setItem("dyslexicFont", e.target.checked);
    });

    // Update monospaced checkbox handler to turn off dyslexic font
    monospacedCheckbox.addEventListener("change", (e) => {
        if (e.target.checked) {
            notepad.note.addClass("monospaced");
            dyslexicFontCheckbox.checked = false;
            notepad.note.removeClass("dyslexic");
            localStorage.setItem("dyslexicFont", "false");
        } else {
            notepad.note.removeClass("monospaced");
        }
        localStorage.setItem("monospaced", e.target.checked);
    });
});

document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement) {
        $("#arrowPointsIn").hide();
        $("#arrowPointsOut").show();
    }
});


// Registering ServiceWorker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("sw.js")
        .then(function (registration) {
            console.log(
                "ServiceWorker registration successful with scope: ",
                registration.scope
            );
        })
        .catch(function (err) {
            console.log("ServiceWorker registration failed: ", err);
        });
}

let deferredPrompt;
window.addEventListener("appinstalled", () => {
    deferredPrompt = null;

    const source = installSource || "browser";

    ga("send", "event", "pwa-install", "installed", source);
});

