var downloadRules = [
    {
        id: "github",
        name: "Github Sorter",
        enabled: true,
        matchType: "url",
        pattern: "github",
        folder: `Github/`,
        priority: "1"
    },
    {
        id: "png",
        name: "Png Sorter",
        enabled: true,
        matchType: "extension",
        pattern: "image/png",
        folder: `PNG/`,
        priority: "2"
    },
    {
        id: "jpeg",
        name: "Jpeg Sorter",
        enabled: true,
        matchType: "extension",
        pattern: "image/jpeg",
        folder: `JPEG/`,
        priority: "3"
    },
    {
        id: "zip",
        name: "Zip Sorter",
        enabled: true,
        matchType: "extension",
        pattern: "application/zip",
        folder: `ZIP/`,
        priority: "4"
    },
    {
        id: "pdf",
        name: "PDF Sorter",
        enabled: true,
        matchType: "extension",
        pattern: "application/pdf",
        folder: `PDF/`,
        priority: "5"
    },

]


chrome.downloads.onCreated.addListener((downloadItem) => {
    console.log("Download Started:", downloadItem.filename, "at", new Date().toISOString())
    console.log("Download ID:", downloadItem.id, "Source URL:", downloadItem.url)
});

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    console.log("onDeterminingFilename CALLED", "Filename MIME: ", downloadItem.mime)

    const baseName = downloadItem.filename.split(/[\\/]/).pop();

    downloadRules.sort((a, b) => a.priority - b.priority)

    for (let i = 0; i < downloadRules.length; i = i + 1) {
        const rule = downloadRules[i];

        if (rule.enabled && rule.matchType === 'extension' && downloadItem.mime === rule.pattern) {

            suggest({
                filename: rule.folder + baseName,
                conflictAction: 'uniquify'
            });

            console.log('Matched Rule:', rule.name, '| Folder:', rule.folder + baseName);
            return;

        } else if (rule.enabled && rule.matchType === 'url' && downloadItem.url.toLowerCase().includes(rule.pattern.toLowerCase())) {
            suggest({
                filename: rule.folder + baseName,
                conflictAction: 'uniquify'
            });
            console.log('Matched Rule:', rule.name, '| Folder:', rule.folder + baseName);
            return
        }

    }

    suggest();
})