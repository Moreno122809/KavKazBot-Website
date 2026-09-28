const API_URL =
    "https://script.google.com/macros/s/AKfycbxj4MyQARTi7sUlHtZHX8Wq6cIX19jJlh596LmJiCdBt49EYwhiG4UK1-bdIwR8ZI1s/exec";


const DEFAULT_STATUS = {
    status: "offline",
    title: "Bot Offline",
    text: "Der Bot ist derzeit offline."
};


const DEFAULT_CHANGELOG = [
    {
        title: "Website gestartet",
        text: "Die neue KavKaz Bot Status-Website wurde eingerichtet.",
        date: "28.09.2026"
    }
];


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


function displayChangelog(entries) {

    const list =
        document.getElementById("changelog-list");


    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (!entries || entries.length === 0) {

        list.innerHTML = `
            <div class="loading">
                Noch keine Change-Log-Einträge vorhanden.
            </div>
        `;

        return;
    }


    entries.forEach(entry => {

        const item =
            document.createElement("div");


        item.className =
            "changelog-entry";


        item.innerHTML = `
            <h3>${escapeHtml(entry.title)}</h3>
            <div class="date">${escapeHtml(entry.date)}</div>
            <p>${escapeHtml(entry.text)}</p>
        `;


        list.appendChild(item);

    });

}


function escapeHtml(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text || "";


    return div.innerHTML;

}


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


function loadLocalChangelog() {

    try {

        const savedChangelog =
            localStorage.getItem(
                "kavkaz_changelog"
            );


        if (savedChangelog) {

            displayChangelog(
                JSON.parse(savedChangelog)
            );

        }

        else {

            displayChangelog(
                DEFAULT_CHANGELOG
            );

        }


    } catch (error) {

        console.error(
            "Fehler beim Laden des Change Logs:",
            error
        );


        displayChangelog(
            DEFAULT_CHANGELOG
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadStatus();

        loadLocalChangelog();

    }
);
