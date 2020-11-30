// ==UserScript==
// @name         Google Keep Encryptor
// @namespace    https://github.com/Naiqus/Google-Keep-Encryptor
// @version      1.0.0
// @description  Hide your sensitive information from Google
// @author       Naiqus
// @match        https://keep.google.com/*
// @grant        GM_addStyle
// @license      MIT
// @copyright    Naiqus (https://github.com/naiqus)
// @require      https://raw.githubusercontent.com/bitwiseshiftleft/sjcl/master/sjcl.js
// ==/UserScript==

// CSS

const css = `.cryptor-btn {
    cursor: pointer;
    display: inline-block;
    outline: none!important;
    opacity: .71;
    height: 16px;
    width: 16px;
    top: 50%;
    margin-top: -10px; 
    border: 1px solid transparent;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 201;
    position: absolute;
    transition: opacity .218s ease-in;
    right: 0px;
    background-size: 24px 24px;
}

.eye-btn {
    width: 14px;
    height: 14px;
    top: 50%;
    margin-top: -7px;
    right: 0px;
    z-index: 202;
    position: absolute;
}

.password {
    white-space: nowrap;
    opacity: .71;
    height: 22px;
    width: 160px;
    border: 1px solid;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 201;
    position: absolute;
    transition: opacity .218s ease-in;
    overflow: hidden;
}

.password-container {
    position: absolute;
    z-index: 201;
    right: 26px;
    height: 24px;
    width: 160px;
}

[contenteditable="true"].password br {
    display:none;

}
[contenteditable="true"].password * {
    display:inline;
    white-space:nowrap;
}

.btn-overlay {
    cursor: pointer;
    display: inline-block;
    outline: none!important;
    top: 16px;
    right: 45px;
    height: 24px;
    width: 200px;
    z-index: 201;
    position: absolute;
}

.create-field{
    top: 10px;
}

.note-overlay {
    border-style: dotted;
    border-width: 2px;
    margin: 5px;
}

.icon {
    width: 20px;
    height: 5px;
}`;

GM_addStyle(css);
const lockedHtml = `<svg focusable="false" data-icon="lock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path class="icon" fill="white" d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"></path></svg>`;
const unlockedHtml = `<svg focusable="false" data-icon="unlock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path class="icon" fill="currentColor" d="M400 256H152V152.9c0-39.6 31.7-72.5 71.3-72.9 40-.4 72.7 32.1 72.7 72v16c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24v-16C376 68 307.5-.3 223.5 0 139.5.3 72 69.5 72 153.5V256H48c-26.5 0-48 21.5-48 48v160c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"></path></svg>`;
const eyeHtml = `<svg focusable="false" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path class="eye" fill="currentColor" d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"></path></svg>`;
const eyeSlashHtml = `<svg focusable="false" data-icon="eye-slash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path class="eye" fill="currentColor" d="M634 471L36 3.51A16 16 0 0 0 13.51 6l-10 12.49A16 16 0 0 0 6 41l598 467.49a16 16 0 0 0 22.49-2.49l10-12.49A16 16 0 0 0 634 471zM296.79 146.47l134.79 105.38C429.36 191.91 380.48 144 320 144a112.26 112.26 0 0 0-23.21 2.47zm46.42 219.07L208.42 260.16C210.65 320.09 259.53 368 320 368a113 113 0 0 0 23.21-2.46zM320 112c98.65 0 189.09 55 237.93 144a285.53 285.53 0 0 1-44 60.2l37.74 29.5a333.7 333.7 0 0 0 52.9-75.11 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64c-36.7 0-71.71 7-104.63 18.81l46.41 36.29c18.94-4.3 38.34-7.1 58.22-7.1zm0 288c-98.65 0-189.08-55-237.93-144a285.47 285.47 0 0 1 44.05-60.19l-37.74-29.5a333.6 333.6 0 0 0-52.89 75.1 32.35 32.35 0 0 0 0 29.19C89.72 376.41 197.08 448 320 448c36.7 0 71.71-7.05 104.63-18.81l-46.41-36.28C359.28 397.2 339.89 400 320 400z"></path></svg>`;

const noteContainerSelector = ".IZ65Hb-n0tgWb";
const openedNoteContainerSelector = noteContainerSelector + ".IZ65Hb-QQhtn";
const createdNotesGroupContainerSelector =
  ".gkA7Yd-sKfxWe.ma6Yeb-r8s4j-gkA7Yd>div";

let isNoteOpened = false;

let createNoteField;
let noteClasses;
let noteContentClass;

// Password overlays
let btnHoverColor;
let lockBtnCallbacks;
let password;
let isPasswordVisible;
let cipherText, plainText, openedNote, isNoteEncrypted;
let pinButtonClasses;
let isDecryptSuccess = false;
let noteOverlay;
let pwInputCallback;
let pwInput;
let eyeBtn;
let color;
let btnsOverlay;
let lockBtn;
let pwContainer;

let openNoteObserver;
let loadMoreNotesObserver;

window.addEventListener("load", event => {
  init();
});

function init() {
  setupUIOverlay();
  //-----------
  // Setup callbacks and subscriptions
  openNoteObserver = new MutationObserver(getOpenedNote);
  observeAllNotes();

  let createdNoteGroupContainer = document.querySelector(
    createdNotesGroupContainerSelector
  );
  loadMoreNotesObserver = new MutationObserver(observeAllNotes);
  loadMoreNotesObserver.observe(createdNoteGroupContainer, {
    childList: true,
    attributes: false,
    subtree: false
  });

  // Listen for popstate - triggered by forward and back buttons, and manual hash entry
  window.addEventListener("popstate", getOpenedNote);

  const resizeObserver = new ResizeObserver(_ => {
    // console.log('size changed');
    if (btnsOverlay != null) {
      btnsOverlay.classList.add("create-field"); //In creation field the button is lower
    }
    createNoteField = getCreateNoteField();
    getOpenedNote();
    resizeObserver.observe(createNoteField.parentNode); // Has to call recursively to take effect
  });

  resizeObserver.observe(createNoteField.parentNode);

  // Observe to the header, for dark/light mode toggle
  var head = document.querySelector("head");
  new MutationObserver(setupUIOverlay).observe(head, {
    childList: true,
    attributes: false,
    subtree: false
  });
}

function observeAllNotes() {
  var notes = document.querySelectorAll(noteContainerSelector);
  if (notes) {
    notes.forEach(note => {
      if (!note.classList.contains("gke-observed")) {
        openNoteObserver.observe(note, {
          childList: false,
          subtree: false,
          attributes: true
        });
        note.classList.add("gke-observed");
      }
    });
  } else {
    console.log("No notes found to be observed!");
  }
}

function setupUIOverlay() {
  createNoteField = getCreateNoteField();
  noteClasses = createNoteField.classList; // note[1] is always the input note bar
  // Get the uglified class name of the note's content
  noteContentClass = noteClasses[noteClasses.length - 1];
  // Get current font color
  color = getComputedStyle(createNoteField).color;
  console.log(noteContentClass, color);
  const rgb = color
    .substring(4, color.length - 1)
    .replace(/ /g, "")
    .split(",")
    .map(x => parseInt(x));

  // Deal with btn's onhover style, can be overkill
  btnHoverColor = rgb[0] < 100 ? "icon-dark" : "icon-light";

  // create dom elements
  btnsOverlay = document.createElement("div");
  btnsOverlay.classList.add("btn-overlay");

  lockBtn = document.createElement("div");
  lockBtn.name = "crypt_btn";
  lockBtn.classList.add("cryptor-btn");
  btnsOverlay.appendChild(lockBtn);

  pwContainer = document.createElement("div");
  btnsOverlay.appendChild(pwContainer);

  pwInput = document.createElement("input");
  eyeBtn = document.createElement("div");

  lockBtnCallbacks = [
    showPasswordCallBack,
    encryptNoteCallback,
    decryptNoteCallback,
    createEncryptedNoteCallback
  ];

  noteOverlay = document.createElement("div");

  //-----------------
  // Handling UI
  noteOverlay.classList.add("note-overlay");
  noteOverlay.style.borderColor = color;
  noteOverlay.setAttribute("contenteditable", "true");
  noteOverlay.setAttribute("role", "textbox");
  noteOverlay.setAttribute("aria-multiline", "true");
  noteOverlay.addEventListener("keydown", callbackHack);
  noteOverlay.addEventListener("keypress", callbackHack);
  noteOverlay.addEventListener("click", callbackHack);
  noteOverlay.addEventListener("input", event => {
    event.stopPropagation();
    lockBtn.click();
  });

  pwContainer.classList.add("password-container");

  pwInput.type = "password";
  pwInput.setAttribute("contenteditable", "true");
  pwInput.setAttribute("role", "textbox");
  pwInput.setAttribute("aria-multiline", "false");
  pwInput.classList.add("password");
  pwInput.addEventListener("click", callbackHack);
  pwInput.addEventListener("keydown", event => {
    event.stopPropagation();
    if (event.key === "Enter") lockBtn.click();
  });
  pwContainer.appendChild(pwInput);

  eyeBtn.name = "eye_btn";
  eyeBtn.classList.add("crytor-btn", "eye-btn");
  eyeBtn.innerHTML = eyeHtml;
  eyeBtn.getElementsByClassName("eye")[0].style.fill = color;
  eyeBtn.addEventListener("click", togglePasswordVisibility);
  pwContainer.appendChild(eyeBtn);

  hidePasswordContainer();
}

function showNoteOverlay(text) {
  // Decrypt succeed
  openedNote.classList.forEach(cls => {
    noteOverlay.classList.add(cls);
  });
  openedNote.parentElement.insertBefore(noteOverlay, openedNote);
  noteOverlay.innerHTML = text;
  noteOverlay.style.display = "block";
}

function hideNoteOverlay(text) {
  // Decrypt succeed
  noteOverlay.style.display = "none";
}

function showBtnsOverlay(parentElement) {
  // Add button overlay
  btnsOverlay.style.display = "inline-block";
  parentElement.parentElement.appendChild(btnsOverlay);
}

function hideBtnsOverlay() {
  btnsOverlay.style.display = "none";
  //   console.log("btns-overlay hidden");
  hidePasswordContainer();
}

function showLockIcon() {
  lockBtn.innerHTML = lockedHtml;
  const lockedIcon = lockBtn.getElementsByClassName("icon")[0];
  lockedIcon.style.fill = color;
  // lockedIcon.classList.add(btnHoverColor);
}

function showUnlockIcon() {
  lockBtn.innerHTML = unlockedHtml;
  const lockedIcon = lockBtn.getElementsByClassName("icon")[0];
  lockedIcon.style.fill = color;
  // lockedIcon.classList.add(btnHoverColor);
}

function togglePasswordVisibility(event) {
  event.stopPropagation();

  if (isPasswordVisible) {
    pwInput.type = "text";
    eyeBtn.innerHTML = eyeSlashHtml;
    eyeBtn.getElementsByClassName("eye")[0].style.fill = color;
  } else {
    pwInput.type = "password";
    eyeBtn.innerHTML = eyeHtml;
    eyeBtn.getElementsByClassName("eye")[0].style.fill = color;
  }

  isPasswordVisible = !isPasswordVisible;
}

function resetPasswordVisibility() {
  isPasswordVisible = false;
  pwInput.type = "password";
  eyeBtn.innerHTML = eyeHtml;
  eyeBtn.getElementsByClassName("eye")[0].style.fill = color;
}

function hidePasswordContainer() {
  // btnsOverlay.removeChild(pwInput);
  pwInput.value = "";
  password = "";
  resetPasswordVisibility();
  pwContainer.style.display = "none";
}

function showPasswordContainer(inputCallback) {
  // input callback for
  pwContainer.style.display = "block";
  pwInput.removeEventListener("input", pwInputCallback);
  if (inputCallback) {
    pwInput.addEventListener("input", event => {
      event.stopPropagation();
      inputCallback(event);
    });
    pwInputCallback = inputCallback;
  }
}

//--------
// Opened note detection

function verifyEncryptJson(note) {
  // Pre-selection
  if (!note.includes('{"iv":')) return false;

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

function getOpenedNote() {
  isNoteOpened = false;

  Array.from(document.getElementsByClassName(noteContentClass)) // All notes
    .filter(el => el.getAttribute("spellcheck") == "true")
    .filter(el => el.getAttribute("contenteditable") == "true")
    .forEach(el => {
      isNoteOpened = true;
      handleOpenedNote(el);
    });

  if (isNoteOpened) return;

  btnsOverlay.classList.remove("create-field");
  hideBtnsOverlay();
  hideNoteOverlay();
  isNoteOpened = false;
  isDecryptSuccess = false;
}

function handleOpenedNote(el) {
  if (isDecryptSuccess) {
    // The opened note is in encryption mode
    return;
  }
  openedNote = el;
  let text = el.innerHTML.replace(/<br>/g, "");

  showBtnsOverlay(el);

  if (verifyEncryptJson(text)) {
    // The note is an encrypted one
    showLockIcon();
    setLockBtnCallback(showPasswordCallBack);
    cipherText = text;
    isNoteEncrypted = true;
  } else {
    // The note is a plain text one
    showUnlockIcon();
    setLockBtnCallback(createEncryptedNoteCallback);
    plainText = el.innerHTML;
    isNoteEncrypted = false;
  }
}

function decryptNote(text, password) {
  try {
    let decryptText = sjcl.json.decrypt(password, text);
    isDecryptSuccess = true;
    return decryptText;
  } catch (e) {
    isDecryptSuccess = false;
    console.log(e);
    return null;
  }
}

function encryptNote(password, text) {
  try {
    let test = sjcl.json.encrypt(password, text);
    return test;
  } catch (e) {
    console.log(e);
  }
}

//------------------
// Lock button callbacks
function showPasswordCallBack(event) {
  console.log("showPasswordCallBack");
  event.stopPropagation();
  showPasswordContainer(event => {
    if (event.key === "Enter") {
      // Now lock button will decrypt the note
      lockBtn.click();
    }
  });
  setLockBtnCallback(decryptNoteCallback);
  pwInput.focus();
}

function createEncryptedNoteCallback(event) {
  console.log("createEncryptedNoteCallback");
  event.stopPropagation();
  isDecryptSuccess = true;
  showNoteOverlay(openedNote.innerHTML);
  // Now lock button will encrypt the note
  setLockBtnCallback(encryptNoteCallback);
  // Show password field
  showPasswordContainer();
}

function decryptNoteCallback(event) {
  console.log("decryptNoteCallback");
  event.stopPropagation();
  password = pwInput.value;
  let text = decryptNote(cipherText, password);
  if (isDecryptSuccess && text !== null) {
    showUnlockIcon();
    showNoteOverlay(text);
    setLockBtnCallback(encryptNoteCallback);
  }
}

function encryptNoteCallback(event) {
  console.log("encryptNoteCallback");
  event.stopPropagation();
  openedNote.innerHTML = encryptNote(pwInput.value, noteOverlay.innerHTML);
  openedNote.dispatchEvent(new Event("input"));
}

function setLockBtnCallback(callback) {
  lockBtnCallbacks.forEach(cb => {
    lockBtn.removeEventListener("click", cb);
  });
  lockBtn.addEventListener("click", callback);
}

function callbackHack(event) {
  event.stopPropagation();
}
// ----------
// Create note field handling, it reset all the attributes, classes
// and event listeners by the native code. Need to handle individually
function getCreateNoteField() {
  let notes = document.querySelectorAll('[aria-multiline="true"]');
  return notes[1];
}
