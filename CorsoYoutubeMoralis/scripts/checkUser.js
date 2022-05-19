checkUser();

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
        document.getElementById("login_buttons").style.display = "none";
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
        document.getElementById("login_buttons").style.display = "block";
        document.getElementById("logout_button").style.display = "none";
        document.getElementById("guide").style.display = "block";
        document.getElementById("logged").style.display = "none";
        document.getElementById("profile").style.display = "none";
        document.getElementById("content").style.display = "none";
        document.getElementById("isNotSigned").style.display = "none";
    }
}

async function hasUploadedFiles(user) {
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

                //console.log(fetchIPFSDoc(object.get("hash_ipfs")));
                //var gg = fetchIPFSDoc(object.get("hash_ipfs"));
                //console.log(gg);
                

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
                
                table += `<td><a href='#' onClick=removeItem('${object.id}')>❌</a></td>`;
                
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

