const input = document.getElementById("ruleInput");
const list = document.getElementById("rulesList");
const rulesList = [{

}]
let ruleCount = 1;

input.addEventListener('keydown', (event) => {
    if (event.key !== "Enter") return;

    const text = input.value.trim();
    if (!text) return;

    ruleCount = ruleCount + 1;

    const uniqueName = `rule${ruleCount}`;
    const radioGroupName = `rule${ruleCount}Type`;

    const uniqueCheckBoxId = `rule${ruleCount}Checkbox`;
    const uniqueExtensionButtonID = `rules${ruleCount}Extension`;
    const uniqueURLButtonID = `rules${ruleCount}File`;
    const uniqueDeleteButtonID = `rules${ruleCount}Delete`;

    const listItem = document.createElement("li");

    // Checkbox
    const newCheckbox = document.createElement("input");
    newCheckbox.type = "checkbox";
    newCheckbox.id = uniqueCheckBoxId;
    newCheckbox.name = uniqueName;
    newCheckbox.value = text;

    const checkboxLabel = document.createElement("label");
    checkboxLabel.htmlFor = uniqueCheckBoxId;
    checkboxLabel.textContent = text;

    // Extension Radio
    const newExtensionButton = document.createElement("input");
    newExtensionButton.type = "radio";
    newExtensionButton.id = uniqueExtensionButtonID;
    newExtensionButton.name = radioGroupName;
    newExtensionButton.value = "Extension";

    const extensionLabel = document.createElement("label");
    extensionLabel.htmlFor = uniqueExtensionButtonID;
    extensionLabel.textContent = "File Extension";

    // URL Radio
    const newURLButton = document.createElement("input");
    newURLButton.type = "radio";
    newURLButton.id = uniqueURLButtonID;
    newURLButton.name = radioGroupName;
    newURLButton.value = "URL";

    const urlLabel = document.createElement("label");
    urlLabel.htmlFor = uniqueURLButtonID;
    urlLabel.textContent = "URL";

    // Delete Button
    const newDeleteButton = document.createElement("button");
    newDeleteButton.type = "button";
    newDeleteButton.id = uniqueDeleteButtonID;
    newDeleteButton.textContent = "Delete";
    newDeleteButton.addEventListener("click", () => {
        listItem.remove();
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

    list.appendChild(listItem);
    input.value = "";
});





