async function filter(){
    const Monster = Moralis.Object.extend("USER_IPFS");
    const query = new Moralis.Query(Monster);
    let user = Moralis.User.current();
    
    const tipo = document.getElementById("filterSelect").value;

    if(tipo === "reset")
        location.reload();
    
    query.equalTo("address", user.get("ethAddress")).equalTo("fileType", tipo);

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
        } else alert("Nessun risultato trovato! 😔")
        
}