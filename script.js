const API_URL =
    "https://script.google.com/macros/s/AKfycbxj4MyQARTi7sUlHtZHX8Wq6cIX19jJlh596LmJiCdBt49EYwhiG4UK1-bdIwR8ZI1s/exec";


const DEFAULT_STATUS = {
    status: "offline",
    title: "Bot Offline",
    text: "Der Bot ist derzeit offline."
};


/* =========================================================
   JSONP
   ========================================================= */

function jsonp(action) {

    return new Promise((resolve, reject) => {

        const callbackName =
            "kavkazCallback_" +
            Date.now() +
            "_" +
            Math.random().toString(36).substring(2);

        const script =
            document.createElement("script");

        let finished = false;

        const timeout = setTimeout(() => {

            if (finished) return;

            finished = true;

            delete window[callbackName];

            script.remove();

            reject(
                new Error(
                    "Zeitüberschreitung beim Laden der Daten."
                )
            );

        }, 10000);


        const cleanup = () => {

            clearTimeout(timeout);

            delete window[callbackName];

            script.remove();

        };


        window[callbackName] = function (data) {

            if (finished) return;

            finished = true;

            cleanup();

            resolve(data);

        };


        script.onerror = function () {

            if (finished) return;

            finished = true;

            cleanup();

            reject(
                new Error(
                    "Google Apps Script konnte nicht geladen werden."
                )
            );

        };


        script.src =
            API_URL +
            "?action=" +
            encodeURIComponent(action) +
            "&callback=" +
            encodeURIComponent(callbackName) +
            "&_=" +
            Date.now();


        document.body.appendChild(script);

    });

}


/* =========================================================
   STATUS LADEN
   ========================================================= */

async function loadStatus() {

    try {

        const data =
            await jsonp("status");


        if (!data || !data.success) {

            console.error(
                "Status konnte nicht geladen werden."
            );

            applyStatus(DEFAULT_STATUS);

            return;

        }


        console.log(
            "Status vom Server:",
            data
        );


        applyStatus({

            status:
                data.status || "offline",

            title:
                data.title ||
                getDefaultStatusTitle(
                    data.status
                ),

            text:
                data.text ||
                getDefaultStatusText(
                    data.status
                )

        });

    } catch (error) {

        console.error(
            "Status konnte nicht geladen werden:",
            error
        );

        applyStatus(DEFAULT_STATUS);

    }

}


/* =========================================================
   STANDARD-TEXTE FÜR STATUS
   ========================================================= */

function getDefaultStatusTitle(status) {

    if (status === "online") {

        return "Bot Online";

    }


    if (status === "maintenance") {

        return "Wartungsarbeiten";

    }


    return "Bot Offline";

}


function getDefaultStatusText(status) {

    if (status === "online") {

        return "Der Bot ist derzeit online.";

    }


    if (status === "maintenance") {

        return "Der Bot befindet sich derzeit in Wartungsarbeiten.";

    }


    return "Der Bot ist derzeit offline.";

}


/* =========================================================
   STATUS ANZEIGEN
   ========================================================= */

function applyStatus(data) {

    const statusElement =
        document.getElementById("status");

    const titleElement =
        document.getElementById("status-title");

    const textElement =
        document.getElementById("status-text");

    const indicator =
        document.getElementById("status-indicator");


    let status =
        String(
            data.status || "offline"
        ).toLowerCase().trim();


    /*
       Nur gültige Status erlauben
    */

    if (
        status !== "online" &&
        status !== "maintenance" &&
        status !== "offline"
    ) {

        status = "offline";

    }


    let title =
        data.title;


    let text =
        data.text;


    /*
       Falls beim Wartungsstatus
       kein Titel gespeichert wurde,
       trotzdem den richtigen Titel anzeigen.
    */

    if (
        !title ||
        title.trim() === "" ||
        (
            status === "maintenance" &&
            title.toLowerCase() === "bot offline"
        )
    ) {

        title =
            getDefaultStatusTitle(status);

    }


    if (
        !text ||
        text.trim() === "" ||
        (
            status === "maintenance" &&
            text.toLowerCase().includes("offline")
        )
    ) {

        text =
            getDefaultStatusText(status);

    }


    if (titleElement) {

        titleElement.textContent =
            title;

    }


    if (textElement) {

        textElement.textContent =
            text;

    }


    if (statusElement) {

        statusElement.className =
            "status-card " + status;

    }


    if (indicator) {

        indicator.className =
            "status-indicator " + status;

    }

}


/* =========================================================
   CHANGE LOG
   ========================================================= */

async function loadChangelog() {

    try {

        const data =
            await jsonp("changelog");


        const container =
            document.getElementById(
                "changelog-list"
            );


        const section =
            document.getElementById(
                "changelog"
            );


        const navLink =
            document.querySelector(
                'a[href="#changelog"]'
            );


        if (!container) {

            return;

        }


        if (
            !data ||
            !data.success ||
            !data.text ||
            !data.text.trim()
        ) {

            if (section) {

                section.style.display =
                    "none";

            }


            if (navLink) {

                navLink.style.display =
                    "none";

            }


            return;

        }


        if (section) {

            section.style.display =
                "";

        }


        if (navLink) {

            navLink.style.display =
                "";

        }


        const date =
            data.date || "";


        container.innerHTML = `

            <div class="changelog-item">

                <div class="changelog-date">
                    ${escapeHtml(date)}
                </div>

                <div class="changelog-content">
                    ${formatChangelog(data.text)}
                </div>

            </div>

        `;

    } catch (error) {

        console.error(
            "Change Log konnte nicht geladen werden:",
            error
        );


        const section =
            document.getElementById(
                "changelog"
            );


        const navLink =
            document.querySelector(
                'a[href="#changelog"]'
            );


        if (section) {

            section.style.display =
                "none";

        }


        if (navLink) {

            navLink.style.display =
                "none";

        }

    }

}


/* =========================================================
   CHANGE LOG FORMATIERUNG
   ========================================================= */

function formatChangelog(text) {

    return escapeHtml(text)
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\n/g, "<br>");

}


/* =========================================================
   HTML SICHERHEIT
   ========================================================= */

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text == null
            ? ""
            : String(text);

    return div.innerHTML;

}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadStatus();

        loadChangelog();

    }
);
