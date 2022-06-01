async function removeItem(objId) {
    const Monster = Moralis.Object.extend("USER_IPFS");
    const query = new Moralis.Query(Monster);

    query.equalTo("objectId", objId);
    const object = await query.first();

    var nomeFile = object.get("ImgName");

    var conf = confirm("Sei sicuro di voler eliminare '" + nomeFile + "'? 🤔");
    
    if (object && conf) {
        object.destroy().then(() => {
            alert("'" + nomeFile + "' è stato eliminato ❌");
            location.reload();
        }, (error) => {
            console.log(error);
            alert("Errore con l'eliminazione del file! Riprovare.");
        });
    }
}

/*
TODO eliminazione cartelle

async function removeFolder(objId) {
    const Monster = Moralis.Object.extend("USER_FOLDERS");
    const query = new Moralis.Query(Monster);

    query.equalTo("objectId", objId);
    const object = await query.first();

    var nomeFile = object.get("folder_name");
    var verify = false;

    var conf = confirm("Sei sicuro di voler eliminare la cartella '" + nomeFile + "'? 🤔");
    var conf2 = confirm("ATTENZIONE!! Se elimini la cartella, eliminerai anche tutti i files presenti al suo interno. Confermare eliminazione?");
    
    if (object && conf && conf2) {
        object.destroy().then(() => {
            alert("Cartella eliminata ❌");

            const Monster2 = Moralis.Object.extend("USER_IPFS");
            const query2 = new Moralis.Query(Monster2);

            query2.equalTo("folder", objId);
            const results = await query.find();

            for (let i = 0; i < results.length; i++) {
                const object = results[i];
                object.destroy();
            }

            //verify = true;
            //location.reload();
        }, (error) => {
            console.log(error);
            alert("Errore con l'eliminazione del file! Riprovare.");
        });
    }

   
    location.reload();
    

}
*/