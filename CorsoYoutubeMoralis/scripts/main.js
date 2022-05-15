// Corso di 6h:  https://youtu.be/MY4WYoZPr-U

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

console.log("user: ");
console.log(Moralis.User.current());

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
                checkUser();
                //location.reload();
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
                //location.reload();
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

async function fetchIPFSDoc(ipfsHash) {
    const url = "https://gateway.moralisipfs.com/ipfs/" + ipfsHash;
    console.log("url: " + url);
    const response = await fetch(url);
    return await response.json();
}

function getLinkIpfs(hash){
    var url = "https://gateway.moralisipfs.com/ipfs/" + hash;
    return url;
}

hasUploadedFiles = async (user) =>{
    if (user) {
        const Monster = Moralis.Object.extend("USER_IPFS");
        const query = new Moralis.Query(Monster);

        query.equalTo("address", user.get("ethAddress"));

        const results = await query.find();
        //alert(results.length);

        if(results.length !== 0) {
            document.getElementById("IPFS_content").style.display = "block";

            let str = "";
            var table = "<table class='table'><thead>";
            table += "<tr><th scope='col'>#</th><th scope='col'>Nome</th>";
            table += "<th scope='col'>Descrizione</th><th scope='col'>Ultima modifica</th>";
            table += "<th scope='col'>Tipo</th>";
            table += "<th scope='col'>File</th><th scope='col'>Json Obj</th>";
            table += "</tr></thead><tbody>";

            for (let i = 0; i < results.length; i++) {
                const object = results[i];
                //alert(object.id + " - " + object.get("text"));

                var linkImg = getLinkIpfs(object.get("ImgHash"));

                table += "<tr><th scope='row'>" + (i + 1) + "</th>";
                table += "<td>" + object.get("ImgName") + "</td>";
                table += "<td>" + object.get("ImgDescription") + "</td>";
                table += "<td>" + object.get("updatedAt").toString().substring(0, 25) + "</td>";
                table += "<td>" + object.get("fileType") + "</td>";
                if(object.get("fileType") === 'Immagine')
                    table += "<td><a href = '" + linkImg + "' target = '_blank'><img style = 'width: 30px;' src = '" + linkImg + "'></a></td>";
                else if(object.get("fileType") === 'Audio')
                    table += "<td><a href = '" + linkImg + "' target = '_blank'>🎵</a></td>";
                else if(object.get("fileType") === 'Video')
                    table += "<td><a href = '" + linkImg + "' target = '_blank'>🎥</a></td>";
                else if(object.get("fileType") === 'Testo')
                    table += "<td><a href = '" + linkImg + "' target = '_blank'>📚</a></td>";
                else
                    table += "<td><a href = '" + linkImg + "' target = '_blank'>link</a></td>";
                table += "<td><a href = '" + getLinkIpfs(object.get("hash_ipfs")) + "' target = '_blank'>⚙️</a></td>";
                table += "</tr>"

                //console.log(table);
            }
            table += "</tbody></table><br>";
            changeValue("getRecords", table);
        }
        else document.getElementById("IPFS_content").style.display = "none";
    } 
    else alert("Metamask not connected!!");
}

/**
 * Controlla se l'utente è loggato o no
 */
function checkUser(){
    let user = Moralis.User.current();

    document.getElementById("isNotSigned").style.display = "none";

    if(user){
        hasUploadedFiles(user);
        //isSigned(user);
        document.getElementById("login_button").style.display = "none";
        document.getElementById("logout_button").style.display = "block";
        document.getElementById("content").style.display = "block";
        changeValue("address", user.get("ethAddress"));
        getProfileData(user);
        changeValue("title", "Bentornato!! 😄");
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

async function getProfileData(user){
    const Monster = Moralis.Object.extend("USER_PHOTO");
    const query = new Moralis.Query(Monster);

    query.equalTo("address", user.get("ethAddress"));

    const results = await query.find();
        
    
    const object = results[0];
    var ris = "";

    if(object.get("image_hash") !== 'undefined'){
        var linkImg = getLinkIpfs(object.get("image_hash"));
        ris += "<img style = 'width: 100px; height: 100px; border-radius: 50px;' src = '" + linkImg + "' alt='Foto profilo'>";
    }
    
    if(object.get("username") !== 'undefined')
        ris += "<p>" + object.get("username") + "</p>";

    changeValue("profileData", ris);
    
}