// Corso di 6h:  https://youtu.be/MY4WYoZPr-U

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

console.log("user: ");
console.log(Moralis.User.current());

/* LOGOUT */
logOut = async () => {
    Moralis.User.logOut();
    console.log("User logged out!");
    alert("Logout effettuato correttamente. Alla prossima! ☺️");
    //checkUser();
    //localStorage.clear();
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
                signingMessage: "Login - Portale archiviazione dati su IPFS by merendamattia.com (mobile version)",
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
                signingMessage: "Login - Portale archiviazione dati su IPFS by merendamattia.com (desktop version)",
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

function getLinkIpfs(hash){
    var url = "https://gateway.moralisipfs.com/ipfs/" + hash;
    return url;
}

async function fetchIPFSDoc(ipfsHash) {
    const url = "https://gateway.moralisipfs.com/ipfs/" + ipfsHash;
    const response = await fetch(url);
    return await response.json();
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
            table += "<th scope='col'>File</th>";
            //table += "<th scope='col'>Json</th>";
            table += "</tr></thead><tbody>";

            for (let i = 0; i < results.length; i++) {
                const object = results[i];
                
                var linkImg = getLinkIpfs(object.get("ImgHash"));

                /*
                Funzione che ritorna il file json dell'oggetto
                */
                var url = getLinkIpfs(object.get("hash_ipfs"));
                var storedText;
                var obj;

                fetch(url).then(function(response) {
                    response.text().then(function(text) {
                        storedText = text;
                        obj =JSON.parse(storedText);
                        console.log(obj);
                    });
                });

                table += "<tr><th scope='row'><a style = 'color: black;' href = '" + getLinkIpfs(object.get("hash_ipfs")) + "' target = '_blank'>" + (i + 1) + "</a></th>";
                table += "<td>" + object.get("ImgName") + "</td>";
                table += "<td>" + object.get("ImgDescription") + "</td>";
                table += "<td>" + object.get("updatedAt").toString().substring(0, 25) + "</td>";
                table += "<td>" + object.get("fileType") + "</td>";

                if(object.get("fileType") === 'Immagine')
                    table += "<td><a href = '" + linkImg + "' target = '_blank'><img style = 'height: 25px;' src = '" + linkImg + "'></a></td>";
                else if(object.get("fileType") === 'Audio')
                    table += "<td><a href = '" + linkImg + "' target = '_blank'>🎵</a></td>";
                else if(object.get("fileType") === 'Video')
                    table += "<td><a href = '" + linkImg + "' target = '_blank'>🎥</a></td>";
                else if(object.get("fileType") === 'Testo')
                    table += "<td><a href = '" + linkImg + "' target = '_blank'>📚</a></td>";
                else if(object.get("fileType") === 'Zip')
                    table += "<td><a href = '" + linkImg + "' target = '_blank'>🗂</a></td>";
                else
                    table += "<td><a href = '" + linkImg + "' target = '_blank'>link</a></td>";
                
                table += `<td><a style="cursor:pointer;" onClick=removeItem('${object.id}')>❌</a></td>`;
                
                table += "</tr>";

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
        document.getElementById("guide").style.display = "none";
        document.getElementById("logout_button").style.display = "block";
        document.getElementById("logged").style.display = "block";
        document.getElementById("content").style.display = "block";
        document.getElementById("profile").style.display = "block";
        
        var address = user.get("ethAddress");
        var newAddress = address.substring(0,4) + "..." + address.substring(address.length - 3, address.length);
        
        changeValue("address", newAddress);

        try{
            getProfileData(user);
        } catch(error){
            console.log(error);
        }
        
        changeValue("title", "Bentornato!! 😄");
    } else {
        document.getElementById("login_button").style.display = "block";
        document.getElementById("logout_button").style.display = "none";
        document.getElementById("guide").style.display = "block";
        document.getElementById("logged").style.display = "none";
        document.getElementById("profile").style.display = "none";
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
