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
const encryptButton = document.createElement("button");
encryptButton.name = "Encrypt";
const decryptButton = document.createElement("button");
decryptButton.name = "decrypt_btn";
decryptButton.innerText = "Decrypt";
let encryptedText;

decryptButton.addEventListener("click", _=> {
    alert(decryptNote(encryptedText, password));
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
            let text = el.innerHTML.replace(/<br>/g, "");
            if (verifyEncryptJson(text)) {
                el.parentElement.appendChild(decryptButton);
                encryptedText = text;
                //overlay.appendChild(decryptButton);
            }
        });
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