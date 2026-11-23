const input = document.getElementById("ruleInput");
const list = document.getElementById("rulesList");

const downloadRules = [{

}]
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
    newCheckbox.value = text;
    newCheckbox.addEventListener("change", (event) => {
        rule.enabled = event.target.checked;
    });

    const checkboxLabel = document.createElement("label");
    checkboxLabel.htmlFor = uniqueCheckBoxId;
    checkboxLabel.textContent = text;

    // Extension Radio
    const newExtensionButton = document.createElement("input");
    newExtensionButton.type = "radio";
    newExtensionButton.id = uniqueExtensionButtonID;
    newExtensionButton.name = radioGroupName;
    newExtensionButton.value = "Extension";
    newExtensionButton.checked = true
    newExtensionButton.addEventListener("change", () => {
        rule.matchType = "extension"
    })


    const extensionLabel = document.createElement("label");
    extensionLabel.htmlFor = uniqueExtensionButtonID;
    extensionLabel.textContent = "File Extension";

    // URL Radio
    const newURLButton = document.createElement("input");
    newURLButton.type = "radio";
    newURLButton.id = uniqueURLButtonID;
    newURLButton.name = radioGroupName;
    newURLButton.value = "URL";
    newURLButton.addEventListener("change", () => {
        rule.matchType = "url";
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
        downloadRules = downloadRules.filter(rules => rule.id !== rule.id);
        listItem.remove()
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

input.addEventListener('keydown', (event) => {
    if (event.key !== "Enter") return;

    const text = input.value.trim();
    if (!text) return;

    ruleCount = ruleCount + 1;

    const newRule = {
        id: `${ruleCount}`,
        name: `${text} Sorter`,
        enabled: true,
        matchType: "extension",
        pattern: text,
        folder: `${text}/`,
        priority: `${ruleCount}`
    };

    downloadRules.push(newRule)
    list.appendChild(createNewRules(newRule))
    input.value = "";
});

document.addEventListener("DOMContentLoaded", () => {
    downloadRules.forEach(rule => list.appendChild(createNewRules(rule)))
    print(downloadRules)
});





