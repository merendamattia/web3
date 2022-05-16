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