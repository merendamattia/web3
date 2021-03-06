async function removeItem(objId) {
    const Monster = Moralis.Object.extend("USER_IPFS");
    const query = new Moralis.Query(Monster);

    query.equalTo("objectId", objId);
    const object = await query.first();

    var nomeFile = object.get("ImgName");

    var conf = confirm("Sei sicuro di voler eliminare '" + nomeFile + "'? ๐ค");

    if (object && conf) {
        object.destroy().then(() => {
            alert("'" + nomeFile + "' รจ stato eliminato โ");
            location.reload();
        }, (error) => {
            console.log(error);
            alert("Errore con l'eliminazione del file! Riprovare.");
        });
    }
}


//TODO eliminazione cartelle

async function removeFolder(objId) {
    const Monster = Moralis.Object.extend("USER_FOLDERS");
    const query = new Moralis.Query(Monster);

    query.equalTo("objectId", objId);
    const object = await query.first();

    var nomeFile = object.get("folder_name");
    var verify = false;

    var conf = confirm("Sei sicuro di voler eliminare la cartella '" + nomeFile + "'? ๐ค");
    var conf2 = confirm("ATTENZIONE!! Se elimini la cartella, eliminerai anche tutti i files presenti al suo interno. Confermare eliminazione?");

    if (object && conf && conf2) {
        object.destroy().then(() => {
            alert("Cartella eliminata โ");

            location.reload();
        }, (error) => {
            console.log(error);
            alert("Errore con l'eliminazione del file! Riprovare.");
        });
    }

    //location.reload();
}
