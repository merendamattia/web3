// Corso di 6h:  https://youtu.be/MY4WYoZPr-U

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

console.log("user: ");
console.log(Moralis.User.current());

function getLinkIpfs(hash){
    var url = "https://gateway.moralisipfs.com/ipfs/" + hash;
    return url;
}

/*
    name:           nome file
    description:    descrizione file
    type:           tipo file
    hash_file:      hash file
    hash_obj:       hash oggetto
    date:           data ultima modifica
    i:              (i - 1)-esimo elemento di result
    id:             objectId

function populateRow(name, description, type, hash_file, hash_obj, date, i, id){
    var row = "";
    row += "<tr><th scope='row'><a style = 'color: black;' href = '" + getLinkIpfs(hash_obj) + "' target = '_blank'>" + (i + 1) + "</a></th>";
    row += "<td>" + name + "</td>";
    row += "<td>" + description + "</td>";
    row += "<td>" + date + "</td>";
    row += "<td>" + type + "</td>";

    var linkImg = getLinkIpfs(hash_file);

    if(type === "Immagine")
        row += "<td><a href = '" + linkImg + "' target = '_blank'><img style = 'height: 25px;' src = '" + linkImg + "'></a></td>";
    else if(type === 'Audio')
        row += "<td><a href = '" + linkImg + "' target = '_blank'>🎵</a></td>";
    else if(type === 'Video')
        row += "<td><a href = '" + linkImg + "' target = '_blank'>🎥</a></td>";
    else if(type === 'Testo')
        row += "<td><a href = '" + linkImg + "' target = '_blank'>📚</a></td>";
    else if(type === 'Zip')
        row += "<td><a href = '" + linkImg + "' target = '_blank'>🗂</a></td>";
    else
        row += "<td><a href = '" + linkImg + "' target = '_blank'>link</a></td>";
                        
    row += "<td><a style='cursor:pointer;' onClick=removeItem('" + id + "')>❌</a></td>";
                        
    row += "</tr>";

    return row;
}*/

function populateRow(name, description, type, hash_file){
    /*
        ${link_hash_obj}:   getLinkIpfs(hash_obj)
        ${counter}:         (i + 1)
        ${name}:            name
        ${description}:     description
        ${date}:            date
        ${type}:            type
        ${link_hash_file}:  getLinkIpfs(hash_file)
        ${icon}:            icon
        ${object_id}:       id
    */

    var icon;

    if(type === "Immagine")
        icon = "<img style = 'height: 25px;' src = '" + getLinkIpfs(hash_file) + "'>";
    else if(type === 'Audio')
        icon = "🎵";
    else if(type === 'Video')
        icon = "🎥";
    else if(type === 'Testo')
        icon = "📚";
    else if(type === 'Zip')
        icon = "🗂";
    else
        icon = "link";
                        
    var templateRow = "<tr><th scope='row'><a style = 'color: black;' href = '${link_hash_obj}' target = '_blank'>${counter}</a></th><td>${name}</td><td>${description}</td><td>${date}</td><td>${type}</td><td><a href = '${link_hash_file}' target = '_blank'>${icon}</a></td><td><a style='cursor:pointer;' onClick=removeItem('${object_id}')>❌</a></td></tr>";

    //templateRow = templateRow.replace("${link_hash_obj}", getLinkIpfs(hash_obj));
    //templateRow = templateRow.replace("${counter}", (i + 1).toString());
    templateRow = templateRow.replace("${name}", name);
    templateRow = templateRow.replace("${description}", description);
    //templateRow = templateRow.replace("${date}", date);
    templateRow = templateRow.replace("${type}", type);
    templateRow = templateRow.replace("${link_hash_file}", getLinkIpfs(hash_file));
    templateRow = templateRow.replace("${icon}", icon);
    //templateRow = templateRow.replace("${object_id}", id);
    
    return templateRow;
}

//  Set nuovo cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

//  Ritorna il valore di un cookie
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

//  Cancella un cookie
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function yourCallback(retrievedText) { 
    var obj = JSON.parse(retrievedText);

    var name = obj.name;
    var description = obj.description;
    var type = obj.type;
    var hash_file = obj.file;
                
    //table += populateRow(name, description, type, hash_file, hash_obj, date, i, object.id);
    table += populateRow(name, description, type, hash_file);
    console.log(table);
    
    sessionStorage.setItem("tablee", table);
    //alert(retrievedText);
}
var table = "";
//  Stampa a video la tabella contenente il risultato della query
hasUploadedFiles = async (user) =>{
    if (user) {
        const Monster = Moralis.Object.extend("USER_IPFS");
        const query = new Moralis.Query(Monster);

        query.equalTo("address", user.get("ethAddress"));

        const results = await query.find();

        if(results.length !== 0) {
            document.getElementById("IPFS_content").style.display = "block";

            let str = "";
            table += "<table class='table'><thead>";
            table += "<tr><th scope='col'>#</th><th scope='col'>Nome</th>";
            table += "<th scope='col'>Descrizione</th><th scope='col'>Ultima modifica</th>";
            table += "<th scope='col'>Tipo</th>";
            table += "<th scope='col'>File</th>";
            table += "</tr></thead><tbody>";

            for (let i = 0; i < results.length; i++) {
                const object = results[i];

                var url = getLinkIpfs(object.get("hash_ipfs"));                     //url ipfs che contiene l'oggetto
                var storedText;                                                     //json che descrive oggetto
                var name, description, hash_obj, type, date, hash_img;              //valori oggetto

                /*fetch(url).then(function(response) {
                    response.text().then(function(text) {
                        storedText = text;
                        setCookie("row" + i, storedText, 0.001);                    //crea un cookie per ogni oggetto
                    });
                });*/


                fetch(url).then((response) => response.text().then(yourCallback));

                table = sessionStorage.getItem("tablee");

                //alert(sessionStorage.getItem("tablee"));

                hash_obj = object.get("hash_ipfs");
                date = object.get("updatedAt").toString().substring(0, 25);

                table = table.replace("${counter}", (i + 1).toString());
                table = table.replace("${object_id}", object.id);
                table = table.replace("${date}", date);
                table = table.replace("${link_hash_obj}", getLinkIpfs(hash_obj));
                
                //console.log(table);
                /*
                var x = getCookie("row" + i);
                var obj = JSON.parse(x);
                
                console.log(obj.name);

                name = obj.name;
                description = obj.description;
                type = obj.type;
                hash_file = obj.file;
                hash_obj = object.get("hash_ipfs");
                date = object.get("updatedAt").toString().substring(0, 25);
                
                table += populateRow(name, description, type, hash_file, hash_obj, date, i, object.id);*/
            } 
            
            table += "</tbody></table><br>";
            console.log(table);
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
        document.getElementById("login_wc").style.display = "none";
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
        document.getElementById("login_wc").style.display = "block";
        document.getElementById("logout_button").style.display = "none";
        document.getElementById("guide").style.display = "block";
        document.getElementById("logged").style.display = "none";
        document.getElementById("profile").style.display = "none";
        document.getElementById("content").style.display = "none";
        document.getElementById("isNotSigned").style.display = "none";
    }
}

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
