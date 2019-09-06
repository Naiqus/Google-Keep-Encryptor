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
overlay.classList.add("overlay");

const decryptButton = document.createElement("div");
decryptButton.name = "decrypt_btn";
decryptButton.addEventListener("click", event => {
    event.stopPropagation();
    //alert(decryptNote(encryptedText, "iqui9oob"));
    showPasswordInput();
});

const inputNode = document.createElement("input");
inputNode.type = "password";
inputNode.setAttribute("contenteditable", "true");
inputNode.setAttribute("role","textbox");
inputNode.setAttribute("aria-multiline", "false");
inputNode.classList.add("password");
inputNode.addEventListener("click", event => {
    event.stopPropagation();
    inputNode.focus();
});

let encryptedText, focusedNote;
let pinButtonClasses;

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
        overlay.appendChild(decryptButton);
        el.parentElement.appendChild(overlay);
        encryptedText = text;
    }
}

function showPasswordInput() {
    inputNode.innerText = "";
    overlay.insertBefore(inputNode, decryptButton);
    inputNode.focus();
    inputNode.addEventListener("keydown", event => {
        event.stopPropagation();
        if(event.key === "Enter"){
            inputNode.value = "";
            alert(decryptNote(encryptedText, inputNode.value));
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
