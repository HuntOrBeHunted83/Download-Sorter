const input = document.getElementById("ruleInput");
const list = document.getElementById("rulesList")
let ruleCount = 1

input.addEventListener('keydown', (event) => {

    if (event.key !== "Enter") {
        return
    }

    const text = input.value.trim();
    if (!text) {
        return
    }

    ruleCount = ruleCount + 1

    const uniqueName = `rule${ruleCount}`

    const uniqueCheckBoxId = `rule${ruleCount}Checkbox`
    const uniqueExtensionButtonID = `rules${ruleCount}Extension`
    const uniqueURLButtonID = `rules${ruleCount}File`


    const listItem = document.createElement("li")

    const newCheckbox = document.createElement("input")
    newCheckbox.type = "checkbox"
    newCheckbox.id = uniqueCheckBoxId
    newCheckbox.name = uniqueName
    newCheckbox.value = text

    const checkboxLabel = document.createElement("label")
    CheckboxLabel.htmlFor = uniqueCheckBoxId
    CheckboxLabel.textContent = text
    CheckboxLabel.name = uniqueName

    const newExtensionButton = document.createElement("input")
    newExtensionButton.type = "radio"
    newExtensionButton.id = uniqueExtensionButtonID
    newExtensionButton.name = uniqueName
    newExtensionButton.value = "Extension"

    const extensionLabel = document.createElement("label")
    ExtensionLabel.htmlFor = uniqueExtensionButtonID
    ExtensionLabel.textContent = "File Extension"
    ExtensionLabel.name = uniqueName

    const newURLButton = document.createElement("input")
    newURLButton.type = "radio"
    newURLButton.id = uniqueURLButtonID
    newURLButton.name = uniqueName
    newURLButton.textContent = "URL"

    const urlLabel = document.createElement("label")
    URLLabel.htmlFor = uniqueURLButtonID
    URLLabel.textContent = "URL"
    URLLabel.name = uniqueName





    listItem.appendChild(newCheckbox);
    listItem.appendChild(checkboxLabel);
    listItem.appendChild(newExtensionButton)
    listItem.appendChild(extensionLabel);
    listItem.appendChild(newURLButton);
    listItem.appendChild(urlLabel)
    list.appendChild(listItem);

    input.value = ""

})