const input = document.getElementById("ruleInput");
const list = document.getElementById("rulesList");
const enabled = document.getElementById("switch");
const content = document.getElementById("hideable-content")
const fallbackFolder = document.getElementById("fallbackFolder")
const fallbackButton = document.getElementById("fallbackButton")
const last10Downloads = document.getElementById("last10Downloads")

let downloadRules = []
let ruleCount = downloadRules.length


function syncAll() {
    downloadRules.forEach((rule, index) => {
        const priorityNumber = String(index + 1);
        rule.priority = priorityNumber;

        const dropdown = document.getElementById(`rules${rule.id}Priority`);
        if (dropdown) {
            dropdown.innerHTML = "";
            for (let i = 1; i <= downloadRules.length; i = i + 1) {
                const option = document.createElement("option");
                option.value = i;
                option.text = i;
                dropdown.appendChild(option)
            }
            dropdown.value = priorityNumber;
        }
    });

    saveRules();
}

async function addDownloads() {
    const stored = await getStorageLocal("last10Downloads")

    if (!Array.isArray(stored)) {
        return
    }

    last10Downloads.innerHTML = "";

    const lastEl = document.createElement("ul");

    for (let i = 0; i < stored.length; i = i + 1) {
        const name = stored[i][0]
        const time = stored[i][1]

        const item = document.createElement("li")
        item.textContent = name + " (" + time + ")"
        lastEl.appendChild(item)
    }

    last10Downloads.appendChild(lastEl)
}

function createNewRules(rule) {
    const uniqueName = `rule${rule.id}`;
    const radioGroupName = `rule${rule.id}Type`;

    const uniqueCheckBoxId = `rule${rule.id}Checkbox`;
    const uniqueExtensionButtonID = `rule${rule.id}Extension`;
    const uniqueURLButtonID = `rule${rule.id}File`;
    const uniqueDeleteButtonID = `rule${rule.id}Delete`;
    const uniquePriorityButtonID = `rules${rule.id}Priority`

    const listItem = document.createElement("li");

    const dropdownData = [
        { value: '', text: "-- Pick a Priority Level" }

    ]

    for (let i = 1; i <= downloadRules.length; i = i + 1) {
        dropdownData.push({
            value: i,
            text: i
        })
    }
    console.log("DROPDOWN DATA", dropdownData)

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
        syncAll()
    });

    // Priority 
    const newPriorityDropdown = document.createElement("select")
    newPriorityDropdown.name = uniqueName
    newPriorityDropdown.id = uniquePriorityButtonID
    for (let i = 0; i < dropdownData.length; i = i + 1) {
        const option = document.createElement("option");
        option.value = dropdownData[i].value
        option.text = dropdownData[i].text

        newPriorityDropdown.appendChild(option)
    }
    newPriorityDropdown.addEventListener("change", (event) => {
        const newIndex = Number(event.target.value) - 1;
        const oldIndex = downloadRules.indexOf(rule)

        const temp = downloadRules[oldIndex]

        downloadRules[oldIndex] = downloadRules[newIndex]
        downloadRules[newIndex] = temp

        syncAll()
    })


    listItem.append(
        newCheckbox,
        checkboxLabel,
        newExtensionButton,
        extensionLabel,
        newURLButton,
        urlLabel,
        newPriorityDropdown,
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
    setStorageLocal({ downloadRules: downloadRules })
}

function syncVisibility() {
    content.hidden = !enabled.checked;
    setStorageLocal({ isEnabled: enabled.checked })
}

function isValidFolder(name) {
    const valid = name.endsWith("/") && !name.includes("..") && !/[<>:"|?*\\]/.test(name);
    return valid
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
        priority: ""
    };

    downloadRules.push(newRule)
    saveRules()
    list.appendChild(createNewRules(newRule))
    syncAll()
    input.value = "";

});

enabled.addEventListener('change', syncVisibility)

fallbackButton.addEventListener('click', (event) => {
    const text = fallbackFolder.value.trim();
    if (text && !isValidFolder(text)) {
        alert('Folder must end with "/" and not contain .. or other illegal characters. Example: Backup/')
        return
    }
    setStorageLocal({ Fallbackfolder: text })
})

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

    try {
        const savedEnabled = await getStorageLocal("isEnabled");
        if (savedEnabled === null || savedEnabled === undefined) {
            enabled.checked = true;
        } else {
            enabled.checked = savedEnabled;
        }
    } catch (error) {
        console.error("Could not load content:", error);
    }

    downloadRules.forEach(rule => list.appendChild(createNewRules(rule)))
    console.log(downloadRules)
    addDownloads()
    syncVisibility()
    syncAll()
});






