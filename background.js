var downloadRules = []

var initialRules = [
    {
        id: "default-mail",
        name: "Mail Sorter",
        enabled: true,
        matchType: "url",
        pattern: "mail",
        folder: "Gmail/",
        priority: "1"
    },
    {
        id: "default-drive",
        name: "Drive Sorter",
        enabled: true,
        matchType: "url",
        pattern: "drive",
        folder: "Google Drive/",
        priority: "2"
    },
    {
        id: "default-outlook",
        name: "Outlook Sorter",
        enabled: true,
        matchType: "url",
        pattern: "outlook",
        folder: "Outlook/",
        priority: "3"
    },
    {
        id: "default-onedrive",
        name: "OneDrive Sorter",
        enabled: true,
        matchType: "url",
        pattern: "onedrive.live.com",
        folder: "OneDrive/",
        priority: "4"
    },
    {
        id: "default-dropbox",
        name: "Dropbox Sorter",
        enabled: true,
        matchType: "url",
        pattern: "dropbox.com",
        folder: "Dropbox/",
        priority: "5"
    },
    {
        id: "default-pdf",
        name: "PDF Sorter",
        enabled: true,
        matchType: "extension",
        pattern: "application/pdf",
        folder: "PDF/",
        priority: "6"
    },
    {
        id: "default-jpeg",
        name: "JPEG Sorter",
        enabled: true,
        matchType: "extension",
        pattern: "image/jpeg",
        folder: "JPEG/",
        priority: "7"
    },
    {
        id: "default-png",
        name: "PNG Sorter",
        enabled: true,
        matchType: "extension",
        pattern: "image/png",
        folder: "PNG/",
        priority: "8"
    },
    {
        id: "default-zip",
        name: "ZIP Sorter",
        enabled: true,
        matchType: "extension",
        pattern: "application/zip",
        folder: "ZIP/",
        priority: "9"
    },
    {
        id: "default-mp4",
        name: "MP4 Sorter",
        enabled: true,
        matchType: "extension",
        pattern: "video/mp4",
        folder: "MP4/",
        priority: "10"
    }
];

const MIME_MAP = {
    JPEG: "image/jpeg",
    JPG: "image/jpeg",
    PNG: "image/png",
    WEBP: "image/webp",
    GIF: "image/gif",
    SVG: "image/svg+xml",
    PDF: "application/pdf",
    DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    PPTX: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    CSV: "text/csv",
    TXT: "text/plain",
    JSON: "application/json",
    ZIP: "application/zip",
    MP4: "video/mp4",
    MP3: "audio/mpeg"
}

async function setStorageLocal(items) {
    try {
        await chrome.storage.local.set(items)
    } catch (error) {
        console.error("Failed to save data to local storage:", error, chrome.runtime.lastError);
    }
}

async function getStorageLocal(key) {
    try {
        let values = await chrome.storage.local.get(String(key))
        if (values && String(key) in values) {
            return values[String(key)]
        }
        return null
    } catch (error) {
        console.error("Failed to get data from local storage: ", error, chrome.runtime.lastError)
    }
}

chrome.downloads.onCreated.addListener((downloadItem) => {
    console.log("Download Started:", downloadItem.filename, "at", new Date().toISOString())
    console.log("Download ID:", downloadItem.id, "Source URL:", downloadItem.url)
});

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    (async () => {
        try {
            const downloadRules = (await getStorageLocal("downloadRules"));
            const fallbackFolder = (await getStorageLocal("Fallbackfolder"))

            console.log("DOWNLOAD RULES:", downloadRules);

            const baseName = downloadItem.filename.split(/[\\/]/).pop();
            downloadRules.sort((a, b) => a.priority - b.priority);

            for (let i = 0; i < downloadRules.length; i = i + 1) {
                if (downloadRules[i].matchType === "extension") {
                    const ext = downloadRules[i].pattern.replace(/^\./, "").toUpperCase();

                    if (MIME_MAP[ext]) {
                        downloadRules[i].pattern = MIME_MAP[ext]
                    }
                }
            }
            console.log("UPDATED RULES: ", downloadRules)

            for (let i = 0; i < downloadRules.length; i = i + 1) {

                const rule = downloadRules[i];
                if (!rule.enabled) continue;

                const isExtensionMatch =
                    rule.matchType === "extension" && downloadItem.mime === rule.pattern;

                const isUrlMatch =
                    rule.matchType === "url" &&
                    downloadItem.url.replace(/[^a-zA-Z]/g, "").toLowerCase().includes(rule.pattern.toLowerCase());

                console.log("Extension MATCH: ", isExtensionMatch, "URL MATCH: ", isUrlMatch)

                if (isExtensionMatch || isUrlMatch) {
                    suggest({
                        filename: rule.folder + baseName,
                        conflictAction: "uniquify",
                    });
                    console.log("Matched Rule:", rule.name, "| Folder:", rule.folder + baseName);
                    return;
                }
            }

            if (fallbackFolder) {
                suggest({
                    filename: fallbackFolder + baseName,
                    conflictAction: "uniquify",
                });
                console.log("No rule matched. Using fallback folder:", fallbackFolder + baseName);
            } else {
                suggest();
            }
            return;
        } catch (error) {
            console.error("Error determining filename:", error);
            suggest();
            return
        }
    })();
    return true;
});

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        console.log("INSTALLED")
        setStorageLocal({ downloadRules: initialRules })
        setStorageLocal({ isEnabled: true })
    }

})
