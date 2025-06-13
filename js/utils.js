function getFileName() {
    return 'Notes-' + getCurrentDate() + '.txt';
}

function getPdfFileName() {
    return 'Notes-' + getCurrentDate() + '.pdf';
}

function getDocxFileName() {
    return 'Notes-' + getCurrentDate() + '.docx';
}

function getHtmlFileName() {
    return 'Notes-' + getCurrentDate() + '.html';
}

function getCurrentDate() {
    const currentDate = new Date();

    return currentDate.getDate() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear();
}

function showToast(message) {
    let toast = document.getElementById('toast');
    toast.className = 'show';
    toast.innerHTML = message;

    setTimeout(function () {
        toast.className = toast.className.replace('show', '');
    }, 2000);
}

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };

        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}

function saveTextAsFile(textToWrite, fileNameToSaveAs) {
    let textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
    let downloadLink = document.createElement('a');
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = 'Download File';

    if (window.webkitURL != null) {
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function getPWADisplayMode() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (document.referrer.startsWith('android-app://')) {
        return 'twa';
    } else if (navigator.standalone || isStandalone) {
        return 'standalone';
    }

    return 'browser';
}

function enableDarkMode(lightmodeText, darkMetaColor, metaThemeColor) {
    $(document.body).addClass('dark');
    $('.navbar').removeClass('navbar-default');
    $('#mode').attr('title', lightmodeText);
    $('#themeIcon').attr('src', 'img/navbar/light-theme.svg')
    metaThemeColor.setAttribute('content', darkMetaColor);
    localStorage.setItem('mode', 'dark');
}

function enableLightMode(darkmodeText, lightMetaColor, metaThemeColor) {
    $(document.body).removeClass('dark');
    $('.navbar').addClass('navbar-default');
    $('#mode').attr('title', darkmodeText);
    $('#themeIcon').attr('src', 'img/navbar/dark-theme.svg')
    metaThemeColor.setAttribute('content', lightMetaColor);
    localStorage.setItem('mode', 'light');
}

function enableDeviceTheme(themeConfig) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        enableDarkMode(themeConfig.lightmodeText, themeConfig.darkMetaColor, themeConfig.metaThemeColor)
    } else {
        enableLightMode(themeConfig.darkmodeText, themeConfig.lightMetaColor, themeConfig.metaThemeColor)
    }

    localStorage.setItem('mode', 'device');
}

function resetFontSize(defaultFontSize) {
    $('#note').css('font-size', defaultFontSize + "px");
    $('#fontSize').val(defaultFontSize);
}

function resetLineHeight(defaultLineHeight) {
    $('#note').css('line-height', defaultLineHeight + "px");
    $('#lineHeight').val(defaultLineHeight);
}

function resetFontWeight(defaultFontWeight) {
    $('#note').css('font-weight', defaultFontWeight);
    $('#fontWeight').val(defaultFontWeight);
}

function resetShowWordCountPill(defaultShowWordCountPill) {
    defaultShowWordCountPill === 'Yes' ? $('.word-count-container').show() : $('.word-count-container').hide();
    $('#showWordCountPill').prop('checked', defaultShowWordCountPill === 'Yes');
}

function resetWriteDirection(defaultWriteDirection) {
    $('#note').css('direction', defaultWriteDirection);
    $('#writeDirection').val(defaultWriteDirection);
}

function resetOptimalLineLength(defaultEditorPadding, defaultOption) {
    const textArea = document.getElementById('note');
    textArea.style.padding = defaultEditorPadding;
    $('#optimalLineLength').prop('checked', defaultOption);
}

function countWords(str) {
    return str.trim().split(/\s+/).length;
}

// Calculate the number of characters and words in a given string.
// Returns a string with the format: "X characters, Y words".
function calculateCharactersAndWords(str) {
    const characterCount = str.length; // Count the number of characters in the string.
    const wordCount = str !== '' ? countWords(str) : 0; // Count the number of words in the string (if it's not empty).
    const characterString = characterCount > 1 ? 'characters' : 'character'; // Use the correct plural form for characters.
    const wordString = wordCount > 1 ? 'words' : 'word'; // Use the correct plural form for words.
    const wordCountText = `${characterCount} ${characterString}, ${wordCount} ${wordString}`; // Format the string with the character and word counts.

    return wordCountText; // Return the formatted string.
}

function copyNotesToClipboard(note) {
    navigator.clipboard.writeText(note).then(function () {
        showToast('Notes copied to clipboard!')
    }, function () {
        showToast('Failure to copy. Check permissions for clipboard.')
    });
}

function deleteNotes() {
    // Get the notepad element from the selector object
    const {notepad} = selector();

    // Create a modal with the title "Want to delete notes?", text "You won't be able to revert this!",
    // icon "warning", confirm button color "#d33", cancel button color "#3085d6" and confirm button text "Delete"
    Swal.fire({
        title: 'Want to delete notes?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Delete'
    }).then((result) => {
        // If the user confirmed the deletion
        if (result.value) {
            // Clear the text area and set the focus back to it
            notepad.note.val('').focus();
            // Set the state of the note to an empty string
            setState('note', '');

            // Show a success modal with the title "Deleted!", text "Your notes has been deleted."
            Swal.fire(
                'Deleted!',
                'Your notes has been deleted.',
                'success'
            )
        }
    })
}

function toggleFocusMode(notepad) {
    const navbar = document.querySelector('.navbar');

    if (!navbar.hasAttribute('style')) {
        navbar.style.display = 'none';
    } else {
        navbar.removeAttribute('style');
    }

    const bodyElement = document.body;

    if (!bodyElement.hasAttribute('style')) {
        bodyElement.style.paddingTop = '0px';
    } else {
        bodyElement.removeAttribute('style');
    }

    const textArea = document.getElementById('note');

    if (!textArea.style.borderRight) {
        textArea.style.borderRight = 'none';
        textArea.style.borderLeft = 'none';
    } else {
        textArea.style.borderRight = '';
        textArea.style.borderLeft = '';
    }

    if (localStorage.getItem('userChosenWordCountPillSelected') == 'Yes') {
        notepad.wordCountContainer.toggle();
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        $('#arrowPointsOut').hide();
        $('#arrowPointsIn').show();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            $('#arrowPointsIn').hide();
            $('#arrowPointsOut').show();
        }
    }
}

function exportNotesAsPDF(textToWrite, fileNameToSaveAs) {
    const pdf = new window.jspdf.jsPDF();
    const marginLeft = 10;
    const marginTop = 10;

    // Width of text area
    const maxWidth = 180;

    const lineHeight = 10;

    // Height of a single page
    const pageHeight = pdf.internal.pageSize.height;

    // Initial Y position for text
    let yPosition = marginTop;

    // Split content into lines that fit within maxWidth
    const lines = pdf.splitTextToSize(textToWrite, maxWidth);

    lines.forEach(line => {
        if (yPosition + lineHeight > pageHeight) {
            pdf.addPage();  // Add a new page if content exceeds page height
            yPosition = marginTop; // Reset Y position for new page
        }
        pdf.text(line, marginLeft, yPosition);
        yPosition += lineHeight;
    });

    pdf.save(fileNameToSaveAs);
}

function exportNotesAsDocx(textToWrite, fileNameToSaveAs) {
    const doc = new docx.Document({
        sections: [{
            properties: {},
            children: [
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: textToWrite,
                        }),
                    ],
                }),
            ],
        }]
    });

    docx.Packer.toBlob(doc).then(blob => {
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = fileNameToSaveAs;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
}

function shareNotes(textToShare) {
    if (navigator.share) {
        navigator.share({
            text: textToShare,
        })
            .then(() => console.log("Successful share"))
            .catch(e => console.log("Error sharing:", e))
    }
}

/**
 * Downloads the text as an HTML file
 * @param {string} textToWrite - The text to write to the file
 * @param {string} fileNameToSaveAs - The name of the file to save as
 */
function downloadHTML(textToWrite, fileNameToSaveAs) {
    // Create the HTML content with the text in a pre tag.
    // The pre tag is used to preserve whitespace and newlines.
    const htmlContent = `<html>
        <head><title>Downloaded HTML</title></head>
        <body>
            <pre style="white-space: pre-wrap; word-wrap: break-word;">${textToWrite}</pre>
        </body>
    </html>`;

    // Create a blob from the HTML content
    const blob = new Blob([htmlContent], {type: "text/html"});

    // Create an anchor element and set the href to the blob and the download attribute to the file name
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileNameToSaveAs;

    // Add the anchor element to the body and click it to download the file
    document.body.appendChild(a);
    a.click();

    // Remove the anchor element from the body
    document.body.removeChild(a);
}