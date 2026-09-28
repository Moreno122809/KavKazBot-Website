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
    const indicator = document.getElementById("status-indicator");
    const title = document.getElementById("status-title");
    const text = document.getElementById("status-text");

    if (!indicator || !title || !text) return;

    indicator.className = "status-indicator";

    if (statusData.status === "online") {
        indicator.classList.add("online");
        title.textContent = "Bot Online";
        text.textContent = statusData.text || "Der Bot ist online und funktioniert.";
    } 
    else if (statusData.status === "maintenance") {
        indicator.classList.add("maintenance");
        title.textContent = "Wartungsarbeiten";
        text.textContent = statusData.text || "Der Bot befindet sich momentan in Wartungsarbeiten.";
    } 
    else {
        indicator.classList.add("offline");
        title.textContent = "Bot Offline";
        text.textContent = statusData.text || "Der Bot ist derzeit offline.";
    }
}

function displayChangelog(entries) {
    const list = document.getElementById("changelog-list");

    if (!list) return;

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
        const item = document.createElement("div");
        item.className = "changelog-entry";

        item.innerHTML = `
            <h3>${escapeHtml(entry.title)}</h3>
            <div class="date">${escapeHtml(entry.date)}</div>
            <p>${escapeHtml(entry.text)}</p>
        `;

        list.appendChild(item);
    });
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
}

function loadLocalData() {
    try {
        const savedStatus = localStorage.getItem("kavkaz_status");
        const savedChangelog = localStorage.getItem("kavkaz_changelog");

        if (savedStatus) {
            setStatus(JSON.parse(savedStatus));
        } else {
            setStatus(DEFAULT_STATUS);
        }

        if (savedChangelog) {
            displayChangelog(JSON.parse(savedChangelog));
        } else {
            displayChangelog(DEFAULT_CHANGELOG);
        }
    } catch (error) {
        console.error("Fehler beim Laden:", error);

        setStatus(DEFAULT_STATUS);
        displayChangelog(DEFAULT_CHANGELOG);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadLocalData();
});
