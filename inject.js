// const notes = document.getElementsByClassName('IZ65Hb-TBnied');

// Get all the notes
const notes = document.querySelectorAll('[aria-multiline="true"]');
const noteClasses = notes[1].classList; // note[1] is always the input note bar
// Get the uglified class name of the note's content
const noteContentClass = noteClasses[noteClasses.length - 1];

// let note, noteContent;

Array.from(notes).forEach(function (el) {
    el.style.backgroundColor = "gray";
    el.addEventListener("click", _ => {
        getEditableNote(el, this);
    });
});

getEditableNote = function(div, callback) {
    setTimeout(function(){
        const openedNote = document.getElementsByClassName(noteContentClass);
        Array.from(openedNote)
            .filter(el => el.innerHTML != '')
            .filter(el => el.getAttribute('contenteditable') == "true")
            .forEach(el => {
                checkNote(el.parentElement, el.innerHTML.replace(/<br>/g, ""));
            });
    }
    ,2000);
    div.removeEventListener("click",callback);
}

isValidEncryptJson = function (note) {
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

checkNote = function (note, noteCOntent) {
    
    if (!isValidEncryptJson(noteCOntent))
        return;
    
    alert("An encrypted note found!!!\n\n" + noteCOntent);
}