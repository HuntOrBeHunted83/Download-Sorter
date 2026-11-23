const input = document.getElementById("ruleInput");
const list = document.getElementById("rulesList");

let downloadRules = []
let ruleCount = downloadRules.length

function createNewRules(rule) {
    const uniqueName = `rule${rule.id}`;
    const radioGroupName = `rule${rule.id}Type`;

    const uniqueCheckBoxId = `rule${rule.id}Checkbox`;
    const uniqueExtensionButtonID = `rule${rule.id}Extension`;
    const uniqueURLButtonID = `rule${rule.id}File`;
    const uniqueDeleteButtonID = `rule${rule.id}Delete`;

    const listItem = document.createElement("li");

    // Checkbox
    const newCheckbox = document.createElement("input");
    newCheckbox.type = "checkbox";
    newCheckbox.id = uniqueCheckBoxId;
    newCheckbox.name = uniqueName;
    newCheckbox.value = rule.pattern;
    newCheckbox.checked = rule.enabled;
    newCheckbox.addEventListener("change", (event) => {
        rule.enabled = event.target.checked;
        saveRules()
    });

    const checkboxLabel = document.createElement("label");
    checkboxLabel.htmlFor = uniqueCheckBoxId;
    checkboxLabel.textContent = rule.pattern;

    // Extension Radio
    const newExtensionButton = document.createElement("input");
    newExtensionButton.type = "radio";
    newExtensionButton.id = uniqueExtensionButtonID;
    newExtensionButton.name = radioGroupName;
    newExtensionButton.value = "extension";
    newExtensionButton.checked = rule.matchType === "extension";
    newExtensionButton.addEventListener("change", () => {
        rule.matchType = "extension"
        saveRules()
    })


    const extensionLabel = document.createElement("label");
    extensionLabel.htmlFor = uniqueExtensionButtonID;
    extensionLabel.textContent = "File Extension";

    // URL Radio
    const newURLButton = document.createElement("input");
    newURLButton.type = "radio";
    newURLButton.id = uniqueURLButtonID;
    newURLButton.name = radioGroupName;
    newURLButton.value = "url";
    newURLButton.checked = rule.matchType === "url"
    newURLButton.addEventListener("change", () => {
        rule.matchType = "url";
        saveRules()
    })

    const urlLabel = document.createElement("label");
    urlLabel.htmlFor = uniqueURLButtonID;
    urlLabel.textContent = "URL";

    // Delete Button
    const newDeleteButton = document.createElement("button");
    newDeleteButton.type = "button";
    newDeleteButton.id = uniqueDeleteButtonID;
    newDeleteButton.textContent = "Delete";
    newDeleteButton.addEventListener("click", () => {
        downloadRules = downloadRules.filter(r => r.id !== rule.id);
        listItem.remove()
        saveRules()
    });

    listItem.append(
        newCheckbox,
        checkboxLabel,
        newExtensionButton,
        extensionLabel,
        newURLButton,
        urlLabel,
        newDeleteButton
    );

    return listItem
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
function saveRules() {
    setStorageLocal({ downloadRules })
}

input.addEventListener('keydown', (event) => {
    if (event.key !== "Enter") return;

    const text = input.value.trim();
    if (!text) return;

    ruleCount = ruleCount + 1;

    const newRule = {
        id: `${Date.now()}`,
        name: `${text} Sorter`,
        enabled: true,
        matchType: "extension",
        pattern: text,
        folder: `${text}/`,
        priority: `${ruleCount}`
    };

    downloadRules.push(newRule)
    saveRules()
    list.appendChild(createNewRules(newRule))
    input.value = "";

});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await getStorageLocal("downloadRules")
        console.log("DATA", data)

        if (Array.isArray(data)) {
            console.log("FUNCTION IS CALLED")
            downloadRules = data
            ruleCount = downloadRules.length;
        }
    } catch (error) {
        console.error("Could not load rules:", error);
    }

    downloadRules.forEach(rule => list.appendChild(createNewRules(rule)))
    console.log(downloadRules)

});





