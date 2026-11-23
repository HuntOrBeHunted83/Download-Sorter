var downloadRules = [
    {
        id: "rule-png",
        name: "Png Sorter",
        enabled: true,
        matchType: "extension",
        pattern: ["png"],
        folder: "Png"
    },
    {
        id: "rule-jpeg",
        name: "Jpeg Sorter",
        enabled: true,
        matchType: "extension",
        pattern: ["jpeg"],
        folder: "Jpeg"
    },

]



chrome.downloads.onCreated.addListener((downloadItem) => {
    console.log("Download Started:", downloadItem.filename, "at", new Date().toISOString())
    console.log("Download ID:", downloadItem.id, "Source URL:", downloadItem.url)
});

browser.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    console.log("onDeterminingFilename CALLED", "Filename MIME: ", downloadItem.mime)
    if (downloadItem.mime === "image/jpeg") {
        const JPEG_PATH = `JPEG/${downloadItem.filename}`
        suggest({
            filename: JPEG_PATH,
            conflictAction: "uniquify",
        })
        console.log("JPEG");

    } else if (downloadItem.mime === "image/png") {
        const PNG_PATH = `PNG/${downloadItem.filename}`
        suggest({
            filename: PNG_PATH,
            conflictAction: "uniquify",
        })
        console.log("PNG")
    } else if (downloadItem.mime === "application/zip") {
        const ZIP_PATH = `ZIP/${downloadItem.filename}`
        suggest({
            filename: ZIP_PATH,
            conflictAction: "uniquify",
        })
        console.log("ZIP")
    } else if (downloadItem.mime === "application/pdf") {
        const PDF_PATH = `PDF/${downloadItem.filename}`
        suggest({
            filename: PDF_PATH,
            conflictAction: "uniquify"
        })
    }



})