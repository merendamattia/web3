// Corso di 6h:  https://youtu.be/MY4WYoZPr-U
const serverUrl = "https://wtj1tfll0vpn.usemoralis.com:2053/server";
const appId = "Tqz949shXNdR4jZ24NBBYCYX0pOW8Ipuxsg4Kf1l";
Moralis.start({ serverUrl, appId });


console.log("user: ");
console.log(Moralis.User.current());

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

/* LOGOUT */
logOut = async () => {
    Moralis.User.logOut();
    console.log("User logged out!");
    alert("User logged out! - Bye Bye");
    checkUser();
    localStorage.clear();
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
                alert("ciao");
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

isSigned = async (user) =>{
    if (user) {
        const Monster = Moralis.Object.extend("USER_SIGNED");
        const query = new Moralis.Query(Monster);

        query.equalTo("address", user.get("ethAddress"));

        const results = await query.find();
        //alert(results.length);

        localStorage.setItem('address', user.get("ethAddress"));
        if(results.length !== 0) document.getElementById("isNotSigned").style.display = "none";
        else document.getElementById("isNotSigned").style.display = "block";
    } 
    else alert("Metamask not connected!!");
}

/**
 * Controlla se l'utente è loggato o no
 */
function checkUser(){
    let user = Moralis.User.current();

    if(user){
        isSigned(user);
        document.getElementById("login_button").style.display = "none";
        document.getElementById("logout_button").style.display = "block";
        document.getElementById("content").style.display = "block";
        changeValue("address", user.get("ethAddress"));
        getUsername(user);
    } else {
        document.getElementById("login_button").style.display = "block";
        document.getElementById("logout_button").style.display = "none";
        document.getElementById("content").style.display = "none";
        document.getElementById("isNotSigned").style.display = "none";
    }
}

document.getElementById("login_button").onclick = logIn;
document.getElementById("logout_button").onclick = logOut;

// RISOLVE UN BUG PER UTENTI IOS
document.addEventListener('visibilitychange', () => {
    if(document.visibilityState === 'hidden') {
        window.localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE');
    }
});

checkUser();

/**
 * Aggiunge un nuovo record alla tabella
 * USER_SIGNED contenente username e address
 */
function addAccount(){
    let name = document.getElementById("name").value;
    localStorage.setItem('name', name);
    window.location.replace("./pages/addAccount.html");
}

async function getUsername(user){
    const Monster = Moralis.Object.extend("USER_SIGNED");
    const query = new Moralis.Query(Monster);

    query.equalTo("address", user.get("ethAddress"));

    const results = await query.find();
        
    for (let i = 0; i < results.length; i++) {
        const object = results[i];
        changeValue("username", "Username: " + object.get("username"));
    }
}
