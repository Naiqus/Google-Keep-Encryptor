// const notes = document.getElementsByClassName('IZ65Hb-TBnied');
// Get all the notes
const notes = document.querySelectorAll('[aria-multiline="true"]');
const noteClasses = notes[1].classList; // note[1] is always the input note bar
const noteContentClass = noteClasses[noteClasses.length - 1];

Array.from(notes).forEach(function (el) {
    el.style.backgroundColor = "gray";
    el.addEventListener("click", _ => {
        checkEditableNote(el, this);
    });
});

checkEditableNote = function(div, callback) {
    setTimeout(function(){
        const openedNote = document.getElementsByClassName(noteContentClass);
        Array.from(openedNote)
            .filter(el => el.innerHTML != '')
            .filter(el => el.getAttribute('contenteditable') == "true")
            .forEach(el => {
                alert(el.innerHTML);
            })
    }
    ,2000); 
    div.removeEventListener("click",callback);
}
