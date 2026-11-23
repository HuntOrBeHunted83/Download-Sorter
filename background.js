var downloadRules = []

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
            console.log("DOWNLOAD RULES:", downloadRules);

            const baseName = downloadItem.filename.split(/[\\/]/).pop();
            downloadRules.sort((a, b) => a.priority - b.priority);

            for (let i = 0; i < downloadRules.length; i++) {
                const rule = downloadRules[i];
                if (!rule.enabled) continue;

                const isExtensionMatch =
                    rule.matchType === "extension" && downloadItem.mime === rule.pattern;
                const isUrlMatch =
                    rule.matchType === "url" &&
                    downloadItem.url.toLowerCase().includes(rule.pattern.toLowerCase());

                if (isExtensionMatch || isUrlMatch) {
                    suggest({
                        filename: rule.folder + baseName,
                        conflictAction: "uniquify",
                    });
                    console.log("Matched Rule:", rule.name, "| Folder:", rule.folder + baseName);
                    return;
                }
            }


            suggest();
        } catch (error) {
            console.error("Error determining filename:", error);
            suggest();
        }
    })();


    return true;
});
