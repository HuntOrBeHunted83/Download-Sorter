var downloadRules = [
    {
        id: "png",
        name: "Png Sorter",
        enabled: true,
        matchType: "extension",
        pattern: "image/png",
        folder: `PNG/`
    },
    {
        id: "jpeg",
        name: "Jpeg Sorter",
        enabled: true,
        matchType: "extension",
        pattern: "image/jpeg",
        folder: `JPEG/`
    },
    {
        id: "zip",
        name: "Zip Sorter",
        enabled: true,
        matchType: "extension",
        pattern: "application/zip",
        folder: `ZIP/`
    },
    {
        id: "pdf",
        name: "PDF Sorter",
        enabled: true,
        matchType: "extension",
        pattern: "application/pdf",
        folder: `PDF/`
    }

]


chrome.downloads.onCreated.addListener((downloadItem) => {
    console.log("Download Started:", downloadItem.filename, "at", new Date().toISOString())
    console.log("Download ID:", downloadItem.id, "Source URL:", downloadItem.url)
});

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    console.log("onDeterminingFilename CALLED", "Filename MIME: ", downloadItem.mime)

    const baseName = downloadItem.filename.split(/[\\/]/).pop();

    for (let i = 0; i < downloadRules.length; i++) {
        const rule = downloadRules[i];

        if (rule.enabled && rule.matchType === 'extension' && downloadItem.mime === rule.pattern) {

            suggest({
                filename: rule.folder + baseName,
                conflictAction: 'uniquify'
            });

            console.log('Matched Rule:', rule.name, '| Folder:', rule.folder + baseName);
            return;
        }
    }

    suggest();
})