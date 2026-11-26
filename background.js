var downloadRules = []

var initialRules = [
    {
        id: "default-google",
        name: "Google",
        enabled: true,
        matchType: "url",
        pattern: "google",
        folder: "Google/",
        priority: "1"
    },
    {
        id: "default-github",
        name: "GitHub",
        enabled: true,
        matchType: "url",
        pattern: "github",
        folder: "GitHub/",
        priority: "2"
    },
    {
        id: "default-reddit",
        name: "Reddit",
        enabled: true,
        matchType: "url",
        pattern: "redd.it",
        folder: "Reddit/",
        priority: "3"
    },
    {
        id: "default-instagram",
        name: "Instagram",
        enabled: true,
        matchType: "url",
        pattern: "instagram",
        folder: "Instagram/",
        priority: "4"
    },
    {
        id: "default-tiktok",
        name: "TikTok",
        enabled: true,
        matchType: "url",
        pattern: "tiktok",
        folder: "TikTok/",
        priority: "5"
    },
    {
        id: "default-pdf",
        name: "PDF",
        enabled: true,
        matchType: "extension",
        pattern: "application/pdf",
        folder: "PDF/",
        priority: "6"
    },
    {
        id: "default-jpeg",
        name: "JPEG",
        enabled: true,
        matchType: "extension",
        pattern: "image/jpeg",
        folder: "JPEG/",
        priority: "7"
    },
    {
        id: "default-png",
        name: "PNG",
        enabled: true,
        matchType: "extension",
        pattern: "image/png",
        folder: "PNG/",
        priority: "8"
    },
    {
        id: "default-zip",
        name: "ZIP",
        enabled: true,
        matchType: "extension",
        pattern: "application/zip",
        folder: "ZIP/",
        priority: "9"
    },
    {
        id: "default-mp4",
        name: "MP4",
        enabled: true,
        matchType: "extension",
        pattern: "video/mp4",
        folder: "MP4/",
        priority: "10"
    },
    {
        id: "default-webp",
        name: "WebP",
        enabled: true,
        matchType: "extension",
        pattern: "image/webp",
        folder: "WebP/",
        priority: "11"
    }
];

const MIME_MAP = {
    // Images
    JPEG: "image/jpeg",
    JPG: "image/jpeg",
    PNG: "image/png",
    WEBP: "image/webp",
    GIF: "image/gif",
    SVG: "image/svg+xml",
    BMP: "image/bmp",
    ICO: "image/x-icon",
    TIFF: "image/tiff",
    TIF: "image/tiff",
    AVIF: "image/avif",
    HEIC: "image/heic",

    // Documents
    PDF: "application/pdf",
    DOC: "application/msword",
    DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    XLS: "application/vnd.ms-excel",
    XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    PPT: "application/vnd.ms-powerpoint",
    PPTX: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ODT: "application/vnd.oasis.opendocument.text",
    ODS: "application/vnd.oasis.opendocument.spreadsheet",
    ODP: "application/vnd.oasis.opendocument.presentation",
    RTF: "application/rtf",
    EPUB: "application/epub+zip",

    // Text and data
    TXT: "text/plain",
    CSV: "text/csv",
    TSV: "text/tab-separated-values",
    HTML: "text/html",
    HTM: "text/html",
    CSS: "text/css",
    JS: "text/javascript",
    JSON: "application/json",
    XML: "application/xml",
    MD: "text/markdown",
    YAML: "application/yaml",
    YML: "application/yaml",

    // Archives
    ZIP: "application/zip",
    RAR: "application/vnd.rar",
    "7Z": "application/x-7z-compressed",
    TAR: "application/x-tar",
    GZ: "application/gzip",
    BZ2: "application/x-bzip2",

    // Video
    MP4: "video/mp4",
    WEBM: "video/webm",
    MKV: "video/x-matroska",
    MOV: "video/quicktime",
    AVI: "video/x-msvideo",
    WMV: "video/x-ms-wmv",
    FLV: "video/x-flv",
    MPEG: "video/mpeg",
    "3GP": "video/3gpp",

    // Audio
    MP3: "audio/mpeg",
    WAV: "audio/wav",
    OGG: "audio/ogg",
    FLAC: "audio/flac",
    AAC: "audio/aac",
    M4A: "audio/mp4",
    WMA: "audio/x-ms-wma",
    OPUS: "audio/opus",

    // Fonts
    TTF: "font/ttf",
    OTF: "font/otf",
    WOFF: "font/woff",
    WOFF2: "font/woff2",

    // Executables and installers
    EXE: "application/vnd.microsoft.portable-executable",
    MSI: "application/x-msi",
    DMG: "application/x-apple-diskimage",
    APK: "application/vnd.android.package-archive",
    DEB: "application/vnd.debian.binary-package",
    ISO: "application/x-iso9660-image"
};

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
            const isEnabled = await getStorageLocal("isEnabled");
            if (isEnabled === false) {
                suggest();
                return;
            }

            const downloadRules = await getStorageLocal("downloadRules");
            const fallbackFolder = await getStorageLocal("Fallbackfolder");

            if (!Array.isArray(downloadRules)) {
                suggest();
                return;
            }

            const baseName = downloadItem.filename.split(/[\\/]/).pop();
            downloadRules.sort((a, b) => a.priority - b.priority);

            for (const rule of downloadRules) {
                if (!rule.enabled) continue;

                let isMatch = false;

                if (rule.matchType === "extension") {
                    const ext = rule.pattern.replace(/^\./, "").toUpperCase();
                    const mime = MIME_MAP[ext] || rule.pattern;
                    isMatch = downloadItem.mime === mime;
                } else if (rule.matchType === "url") {
                    const pattern = rule.pattern.toLowerCase();
                    const candidates = [downloadItem.url, downloadItem.finalUrl, downloadItem.referrer];
                    isMatch = candidates.some(u => {
                        try { return new URL(u).hostname.includes(pattern); }
                        catch { return false; }
                    });
                }

                if (isMatch) {
                    suggest({
                        filename: rule.folder + baseName,
                        conflictAction: "uniquify",
                    });
                    console.log("Matched Rule:", rule.name, "|", rule.folder + baseName);
                    return;
                }
            }

            if (fallbackFolder) {
                suggest({
                    filename: fallbackFolder + baseName,
                    conflictAction: "uniquify",
                });
            } else {
                suggest();
            }
        } catch (error) {
            console.error("Error determining filename:", error);
            suggest();
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

chrome.downloads.onChanged.addListener((delta) => {
    console.log("DOWNLOAD DETECTED")

    if (!delta.state || delta.state.current !== "complete") {
        return;
    }

    chrome.downloads.search({ id: delta.id }, async (results) => {

        console.log("DOWNLOAD STARTED")

        if (!results || !results[0]) {
            return
        };

        const item = results[0];

        const actualName = item.filename.split(/[/\\]/).pop();

        const actualTime = new Date(item.endTime || Date.now()).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        })

        let last10Downloads = await getStorageLocal("last10Downloads")

        if (!Array.isArray(last10Downloads)) {
            last10Downloads = [];
        }

        last10Downloads.push([actualName, actualTime])

        if (last10Downloads.length > 10) {
            last10Downloads.shift();
        }

        await setStorageLocal({ last10Downloads: last10Downloads })
    })

})