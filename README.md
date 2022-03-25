<img src="https://github.com/Naiqus/Google-Keep-Encryptor/raw/master/images/GKE%20Tile.png" alt="Tile" width="330px" height="210px">

With Google Keep Encryptor, you can easily keep your sensitive information only with you and your trustworthy friends. Your text will be encrypted into ciphertext with the help of [Stanford Javascript Crypto Library
](http://bitwiseshiftleft.github.io/sjcl/).

> SJCL is secure. It uses the industry-standard AES algorithm at 128, 192 or 256 bits; the SHA256 hash function; the HMAC authentication code; the PBKDF2 password strengthener; and the CCM and OCB authenticated-encryption modes. Just as importantly, the default parameters are sensible: SJCL strengthens your passwords by a factor of 1000 and salts them to protect against rainbow tables, and it authenticates every message it sends to prevent it from being modified.

<img src="https://raw.githubusercontent.com/Naiqus/Google-Keep-Encryptor/master/images/GKE%20Screenshot.png" alt="Screenshot" width="600px" height="600px">

**WARNING: If you don't remember the password, you will lose all the information on that encrypted note!!!** It's strongly recommended to use password hints as labels or add them to the titles of your encrypted notes.

## Installation

- For Chrome: [Link to Chrome Web Store](https://chrome.google.com/webstore/detail/google-keep-encryptor/cedkkpjolghccafognlkficihjmfedhc)
- For Firefox: Please install [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/). Then install the UserScript from [here](https://openuserjs.org/scripts/Naiqus/Google_Keep_Encryptor#google-keep-encryptor)

## On Android and iOS Devices
Currently the Chrome mobile app doesn't support extensions. In order to decrypt your notes, you have to install the [Tampermonkey script](https://openuserjs.org/scripts/Naiqus/Google_Keep_Encryptor#google-keep-encryptor) on your phone and use the Google Keep website on mobile browsers (bookmark it).

Here is a nice tutorial of how to [run Tampermonkey scripts on Android and iOS](https://chrunos.com/tampermonkey-scripts-for-mobile/).

- Android: You will need to install **Firefox Nightly**.
- iOS: You will need to install **Userscripts** Safari extension. Afterwards, you should be able to install the script when you open [this link](https://openuserjs.org/scripts/Naiqus/Google_Keep_Encryptor#google-keep-encryptor)  on Safari.

