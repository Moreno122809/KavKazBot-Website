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
// BOT STATUS ANZEIGEN
// ========================================

function setStatus(statusData) {

    const indicator =
        document.getElementById("status-indicator");

    const title =
        document.getElementById("status-title");

    const text =
        document.getElementById("status-text");


    if (!indicator || !title || !text) {
        return;
    }


    indicator.className =
        "status-indicator";


    if (statusData.status === "online") {

        indicator.classList.add("online");

        title.textContent =
            "Bot Online";

        text.textContent =
            statusData.text ||
            "Der Bot ist online und funktioniert.";

    }

    else if (statusData.status === "maintenance") {

        indicator.classList.add("maintenance");

        title.textContent =
            "Wartungsarbeiten";

        text.textContent =
            statusData.text ||
            "Der Bot befindet sich momentan in Wartungsarbeiten.";

    }

    else {

        indicator.classList.add("offline");

        title.textContent =
            "Bot Offline";

        text.textContent =
            statusData.text ||
            "Der Bot ist derzeit offline.";

    }

}


// ========================================
// CHANGE LOG BEREICH EIN-/AUSBLENDEN
// ========================================

function setChangelogVisibility(visible) {

    const section =
        document.getElementById("changelog");

    const navLink =
        document.querySelector(
            'nav a[href="#changelog"]'
        );


    if (section) {

        section.style.display =
            visible ? "" : "none";

    }


    if (navLink) {

        navLink.style.display =
            visible ? "" : "none";

    }

}


// ========================================
// CHANGE LOG ANZEIGEN
// ========================================

function displayChangelog(entries) {

    const list =
        document.getElementById("changelog-list");


    if (!list) {
        return;
    }


    // ========================================
    // KEIN CHANGE LOG
    // ========================================

    if (
        !entries ||
        !Array.isArray(entries) ||
        entries.length === 0
    ) {

        setChangelogVisibility(false);

        return;

    }


    // ========================================
    // NUR DEN NEUESTEN EINTRAG VERWENDEN
    // ========================================

    const latestEntry =
        entries[entries.length - 1];


    if (!latestEntry) {

        setChangelogVisibility(false);

        return;

    }


    // ========================================
    // CHANGE LOG SICHTBAR MACHEN
    // ========================================

    setChangelogVisibility(true);


    list.innerHTML = "";


    const item =
        document.createElement("div");


    item.className =
        "changelog-entry";


    item.innerHTML = `
        <h3>${escapeHtml(latestEntry.title)}</h3>
        <div class="date">${escapeHtml(latestEntry.date)}</div>
        <p>${escapeHtml(latestEntry.text)}</p>
    `;


    list.appendChild(item);

}


// ========================================
// HTML SICHER MACHEN
// ========================================

function escapeHtml(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text || "";


    return div.innerHTML;

}


// ========================================
// STATUS LADEN
// ========================================

async function loadStatus() {

    try {

        const response =
            await fetch(
                API_URL + "?action=status"
            );


        if (!response.ok) {

            throw new Error(
                "Status konnte nicht geladen werden."
            );

        }


        const status =
            await response.json();


        setStatus(status);


    } catch (error) {

        console.error(
            "Fehler beim Laden des Bot-Status:",
            error
        );


        setStatus(
            DEFAULT_STATUS
        );

    }

}


// ========================================
// CHANGE LOG AUS LOCAL STORAGE LADEN
// ========================================

function loadLocalChangelog() {

    try {

        const savedChangelog =
            localStorage.getItem(
                "kavkaz_changelog"
            );


        // ========================================
        // KEIN CHANGE LOG GESPEICHERT
        // ========================================

        if (!savedChangelog) {

            displayChangelog([]);

            return;

        }


        const changelog =
            JSON.parse(
                savedChangelog
            );


        // ========================================
        // CHANGE LOG ANZEIGEN
        // ========================================

        if (Array.isArray(changelog)) {

            displayChangelog(
                changelog
            );

        }

        else {

            displayChangelog([]);

        }


    } catch (error) {

        console.error(
            "Fehler beim Laden des Change Logs:",
            error
        );


        displayChangelog([]);

    }

}


// ========================================
// SEITE STARTEN
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // Change Log zunächst verstecken,
        // damit kein leerer Bereich erscheint.

        setChangelogVisibility(false);


        loadStatus();

        loadLocalChangelog();

    }
);
