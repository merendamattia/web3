// Corso di 6h:  https://youtu.be/MY4WYoZPr-U
const serverUrl = "https://wtj1tfll0vpn.usemoralis.com:2053/server";
const appId = "Tqz949shXNdR4jZ24NBBYCYX0pOW8Ipuxsg4Kf1l";
Moralis.start({ serverUrl, appId });

checkUser();
console.log("user: ");
console.log(Moralis.User.current());
changeValue("session", Moralis.User.current());

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

/* LOGOUT */
logOut = async () => {
    Moralis.User.logOut();
    console.log("User logged out!");
    alert("User logged out! - Bye Bye");
    checkUser();
    location.reload();    
}

/* LOGIN */
logIn = async () => {
    let user = Moralis.User.current();
    if (!user) {
        // controllo se l'utente è connesso dal cellulare o pc
        if(typeof screen.orientation === 'undefined'){
            // cellulare
            const user = await Moralis.authenticate({ 
                provider: "walletconnect", 
                signingMessage: "Login by merendamattia.com (mobile login)",
                mobileLinks: [
                  "rainbow",
                  "metamask",
                  "argent",
                  "trust",
                  "imtoken",
                  "pillar",
                ] 
            }).then(function (user){
                checkUser();
                location.reload();
            }).catch(function (error) {
                changeValue("error", "<b>Error:</b> " + error.message + "<br><b>Code:</b> " + error.code);
                console.log(error);
            });
        } else {
            // pc
            user = await Moralis.authenticate({
                signingMessage: "Login by merendamattia.com (desktop login)",
            }).then(function (user){
                checkUser();
                location.reload();
            }).catch(function (error) {
                changeValue("error", "<b>Error:</b> " + error.message + "<br><b>Code:</b> " + error.code);
                console.log(error);
            });
        }
    }
}

/**
 * Controlla se l'utente è loggato o no
 */
function checkUser(){
    user = Moralis.User.current();

    if(user){
        document.getElementById("login_button").style.display = "none";
        document.getElementById("logout_button").style.display = "block";
        document.getElementById("content").style.display = "block";
        changeValue("address", "Address: " + user.get("ethAddress"));
    } else {
        document.getElementById("login_button").style.display = "block";
        document.getElementById("logout_button").style.display = "none";
        document.getElementById("content").style.display = "none";
    }
}

document.getElementById("login_button").onclick = logIn;
document.getElementById("logout_button").onclick = logOut;

// RISOLVE UN BUG PER UTENTI IOS
/*document.addEventListener('visibilitychange', () => {
    if(document.visibilityState === 'hidden') {
        window.localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE');
    }
});*/