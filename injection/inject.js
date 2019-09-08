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
const btnsOverlay = document.createElement("div");
btnsOverlay.classList.add("overlay");

const decryptButton = document.createElement("div");
decryptButton.name = "decrypt_btn";
decryptButton.addEventListener("click", event => {
    event.stopPropagation();
    //alert(decryptNote(encryptedText, "iqui9oob"));
    showPasswordInput();
});

let password;

const pwInput = document.createElement("input");
pwInput.type = "password";
pwInput.setAttribute("contenteditable", "true");
pwInput.setAttribute("role", "textbox");
pwInput.setAttribute("aria-multiline", "false");
pwInput.classList.add("password");
pwInput.addEventListener("click", fixCallback);

let divOverlay = document.createElement("div");

let cipherText, openedNote;
let pinButtonClasses;

function verifyEncryptJson(note) {
    // Pre-selection
    if (!note.includes("{\"iv\":"))
        return false;

    try {
        const encrypJson = JSON.parse(note);
        if (encrypJson.hasOwnProperty("iv")) {
            return true;
        }
        return false;
    } catch (e) {
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
            return;
        });
    // No popup note found.
    if (btnsOverlay.contains(pwInput)){
        btnsOverlay.removeChild(pwInput);
        pwInput.value = "";
        password = "";
    }
}

function handlePopupNote(el) {
    openedNote = el;
    let text = el.innerHTML.replace(/<br>/g, "");
    if (verifyEncryptJson(text)) {
        decryptButton.classList.add("decryptBtn");
        decryptButton.classList.add("cryptorBtn");
        btnsOverlay.appendChild(decryptButton);
        el.parentElement.appendChild(btnsOverlay);
        cipherText = text;
    }
}

function showPasswordInput() {
    pwInput.innerText = "";
    if (!btnsOverlay.contains(pwInput)){
        btnsOverlay.insertBefore(pwInput, decryptButton);
        pwInput.addEventListener("keydown", event => {
            event.stopPropagation();
            password = pwInput.value;
            if (event.key === "Enter") {
                let text = decryptNote(cipherText, password);
                showNoteOverlay(text);
                //pwInput.value = "";
            }
        });
    }
    pwInput.focus();
}

function showNoteOverlay(text) {
    openedNote.classList.forEach(cls => {
        divOverlay.classList.add(cls);
    });
    openedNote.style.display = "none";
    openedNote.parentElement.insertBefore(divOverlay, openedNote);
    divOverlay.innerHTML = text;
    divOverlay.setAttribute("contenteditable", "true");
    divOverlay.setAttribute("role", "textbox");
    divOverlay.setAttribute("aria-multiline", "true");
    divOverlay.addEventListener("keydown", fixCallback);
    divOverlay.addEventListener("keypress", fixCallback);
    divOverlay.addEventListener("input", event => {
        openedNote.innerHTML = onPlainTextChange(event);
        openedNote.dispatchEvent(new Event("input"));
    });
    divOverlay.addEventListener("click", fixCallback);

}

function onPlainTextChange(event) {
    event.stopPropagation();
    cipherText = encryptNote(pwInput.value, divOverlay.innerHTML);
    return cipherText;
}

function decryptNote(text, password) {
    try {
        return sjcl.json.decrypt(password, text)
    } catch (e) {
        console.log(e);
        //return e.msg;
    }
}

function encryptNote(password, text) {
    try{
        let test = sjcl.json.encrypt(password, text);
        console.log(test);
        return test;
    } catch (e) {
        console.log(e);
        //return e.msg;
    }
}

//-----------
// Monitoring
// Callback function to execute when mutations are observed
const config = {
    childList: true,
    subtree: true
};
const callback = function (mutationsList, observer) {
    // Throttle the event to reduce the callback frequency.
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

function fixCallback(event) {
    event.stopPropagation();
}