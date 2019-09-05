// Get all the notes
const throttleDuration = 500; //0.5 second
let notes = document.querySelectorAll('[aria-multiline="true"]');
const inputField = notes[1];
const noteClasses = notes[1].classList; // note[1] is always the input note bar
// Get the uglified class name of the note's content
const noteContentClass = noteClasses[noteClasses.length - 1];
// inputField.setAttribute("encryptorinjected", "true");
console.log(noteContentClass);

// create dom elements
const overlay = document.createElement("div");
const encryptButton = document.createElement("div");
encryptButton.name = "Encrypt";
const decryptButton = document.createElement("div");
decryptButton.name = "decrypt_btn";
let encryptedText, focusedNote;
let pinButtonClasses;

decryptButton.addEventListener("click", _=> {
    alert(decryptNote(encryptedText, password));
    showPasswordInput();
});

function isStringMaybeEncrypted(note){
    return note.includes("{\"iv\":");
}

function verifyEncryptJson(note) {
    // Pre-selection
    if (!note.includes("{\"iv\":"))
        return false;

    try{
        const encrypJson = JSON.parse(note);
        if (encrypJson.hasOwnProperty("iv")) {
            return true;
        }
        return false;
    }
    catch(e) {
        return false;
    }
}

function findPopupNote() {
    const editableNotes = document.getElementsByClassName(noteContentClass);
    Array.from(editableNotes)
        .filter(el => el.innerHTML != '')
        .filter(el => el.getAttribute('contenteditable') == "true")
        .forEach(el => {
            handlePopupNote(el);
        });
}

function handlePopupNote(el) {
    focusedNote = el;
            let text = el.innerHTML.replace(/<br>/g, "");
            if (verifyEncryptJson(text)) {
                decryptButton.classList.add("decryptBtn");
                decryptButton.classList.add("cryptorBtn");
                el.parentElement.appendChild(decryptButton);
                encryptedText = text;
            }
}

function showPasswordInput() {
    let inputNode = document.createElement("input");
    inputNode.inputMode = "password";

    // focusedNote.classList.forEach(cls => {
    //     inputNode.classList.add(cls);
    // });
    // noteclone.innerHTML = "Please input password";
    focusedNote.parentElement.appendChild(inputNode);
}

function decryptNote(noteContent, password) {
    try{
        return sjcl.json.decrypt(password, noteContent)
    } catch(e) {
        console.log(e);
        return e.msg;
    }
}

//-----------
// Monitoring
// Callback function to execute when mutations are observed
const config = { childList: true, subtree: true };
const callback = function(mutationsList, observer) {
    if (mutationsList.length > 10) { // won't observe small changes
        observer.disconnect();
        setTimeout(_ => {
            if (mutationsList[0].type === 'childList') {
                console.log('child node changed');
                findPopupNote();
                observer.observe(document, config);
            }
        }, throttleDuration)
        
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);
// Start observing the target node for configured mutations
observer.observe(document, config);
