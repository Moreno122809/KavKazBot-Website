const API_URL =
    "https://script.google.com/macros/s/AKfycbxj4MyQARTi7sUlHtZHX8Wq6cIX19jLlh596LmJiCdBt49EYwhiG4UK1-bdIwR8ZI1s/exec";


// ========================================
// STANDARD STATUS
// ========================================

const DEFAULT_STATUS = {
    status: "offline",
    title: "Bot Offline",
    text: "Der Bot ist derzeit offline."
};


// ========================================
// STATUS ANZEIGEN
// ========================================

function setStatus(statusData) {

    const indicator =
        document.getElementById(
            "status-indicator"
        );

    const title =
        document.getElementById(
            "status-title"
        );

    const text =
        document.getElementById(
            "status-text"
        );


    if (!indicator || !title || !text) {

        return;

    }


    const status =
        statusData.status ||
        "offline";


    indicator.className =
        "status-indicator " +
        status;


    title.textContent =
        statusData.title ||
        getStatusTitle(status);


    text.textContent =
        statusData.text ||
        "Der aktuelle Status ist nicht verfügbar.";

}


// ========================================
// STATUS TITEL
// ========================================

function getStatusTitle(status) {

    if (status === "online") {

        return "Bot Online";

    }


    if (status === "maintenance") {

        return "Wartungsarbeiten";

    }


    return "Bot Offline";

}


// ========================================
// CHANGE LOG ANZEIGEN
// ========================================

function displayChangelog(changelog) {

    const section =
        document.getElementById(
            "changelog"
        );


    const list =
        document.getElementById(
            "changelog-list"
        );


    const navLink =
        document.getElementById(
            "changelog-nav-link"
        );


    if (!section || !list) {

        return;

    }


    // ========================================
    // KEIN CHANGE LOG
    // ========================================

    if (
        !changelog ||
        !changelog.text ||
        !changelog.text.trim()
    ) {

        section.style.display =
            "none";


        if (navLink) {

            navLink.style.display =
                "none";

        }


        return;

    }


    // ========================================
    // CHANGE LOG VORHANDEN
    // ========================================

    section.style.display =
        "block";


    if (navLink) {

        navLink.style.display =
            "inline-block";

    }


    const title =
        escapeHtml(
            changelog.title ||
            "Change Log"
        );


    const date =
        escapeHtml(
            changelog.date ||
            ""
        );


    const text =
        formatChangelogText(
            changelog.text
        );


    list.innerHTML = `

        <div class="changelog-item">

            <div class="changelog-top">

                <h3>
                    ${title}
                </h3>

                ${
                    date
                        ? `
                            <span class="changelog-date">
                                ${date}
                            </span>
                          `
                        : ""
                }

            </div>

            <div class="changelog-text">
                ${text}
            </div>

        </div>

    `;

}


// ========================================
// CHANGE LOG TEXT FORMATIEREN
// ========================================

function formatChangelogText(text) {

    let result =
        escapeHtml(
            String(text)
        );


    // ========================================
    // **FETT**
    // ========================================

    result =
        result.replace(

            /\*\*(.*?)\*\*/g,

            "<strong>$1</strong>"

        );


    // ========================================
    // ZEILENUMBRÜCHE
    // ========================================

    result =
        result.replace(
            /\r?\n/g,
            "<br>"
        );


    return result;

}


// ========================================
// HTML SICHER MACHEN
// ========================================

function escapeHtml(text) {

    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ========================================
// STATUS LADEN
// ========================================

async function loadStatus() {

    try {

        const response =
            await fetch(

                API_URL +
                "?action=status"

            );


        if (!response.ok) {

            throw new Error(
                "Status konnte nicht geladen werden."
            );

        }


        const data =
            await response.json();


        setStatus({

            status:
                data.status ||
                DEFAULT_STATUS.status,

            title:
                data.title ||
                getStatusTitle(
                    data.status ||
                    DEFAULT_STATUS.status
                ),

            text:
                data.text ||
                DEFAULT_STATUS.text

        });


    } catch (error) {

        console.error(
            "Status konnte nicht geladen werden:",
            error
        );


        setStatus(
            DEFAULT_STATUS
        );

    }

}


// ========================================
// CHANGE LOG LADEN
// ========================================

async function loadChangelog() {

    try {

        const response =
            await fetch(

                API_URL +
                "?action=changelog"

            );


        if (!response.ok) {

            throw new Error(
                "Change Log konnte nicht geladen werden."
            );

        }


        const result =
            await response.json();


        if (
            !result ||
            result.success === false
        ) {

            throw new Error(

                result &&
                result.error

                    ? result.error

                    : "Change Log konnte nicht geladen werden."

            );

        }


        displayChangelog(
            result.changelog ||
            null
        );


    } catch (error) {

        console.error(
            "Change Log konnte nicht geladen werden:",
            error
        );


        // Bei Fehlern wird der Bereich
        // sicherheitshalber ausgeblendet.

        displayChangelog(
            null
        );

    }

}


// ========================================
// START
// ========================================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadStatus();

        loadChangelog();

    }

);
