// Crea una nuova cartella
function createFolder() {
    const Monster = Moralis.Object.extend("USER_FOLDERS");
    const monster = new Monster();

    monster.set("address", user.get("ethAddress"));
    monster.set("folder_name", document.getElementById("folder-name").value);
    monster.set("folder_parent", document.getElementById("folder1").value);
    monster.set("folder_child", "null");
    monster.setACL(new Moralis.ACL(Moralis.User.current()));

    monster.save().then(
        (monster) => {
            // Execute any logic that should take place after the object is saved.
            alert("Cartella creata!! 🥳");
            location.reload();
        },
        (error) => {
            alert("Errore nella creazione della cartella. Riprovare. 😢");
        }
    );
}

// Sposta il file in un'altra cartella
async function moveFile() {
    const objId = localStorage.getItem("objID");
    const newFolder = document.getElementById("folder3").value;

    const MonsterCreature = Moralis.Object.extend('USER_IPFS');
    const query = new Moralis.Query(MonsterCreature);

    query.equalTo("objectId", objId);

    const monster = await query.first();

    monster.set("folder", newFolder);
    monster.save().then(
        (monster) => {
            //alert("File spostato correttamente!! 🥳");
            location.reload();
        },
        (error) => {
            alert("Errore nello spostamento del file. Riprovare. 😢");
        });
}

// Stampa a video tutte le cartelle create
async function getFolders() {
    const Monster = Moralis.Object.extend("USER_FOLDERS");
    const query = new Moralis.Query(Monster);

    query.equalTo("address", user.get("ethAddress"));

    const results = await query.descending("updatedAt").find();
    var select1 = document.getElementById('folder1');
    var select2 = document.getElementById('folder2');
    var select3 = document.getElementById('folder3');

    if (results.length !== 0) {
        for (let i = 0; i < results.length; i++) {
            const object = results[i];

            var opt = document.createElement('option');
            opt.value = object.id;
            opt.innerHTML = object.get("folder_name");

            select1.appendChild(opt);
        }

        for (let i = 0; i < results.length; i++) {
            const object = results[i];

            var opt = document.createElement('option');
            opt.value = object.id;
            opt.innerHTML = object.get("folder_name");

            select2.appendChild(opt);
        }

        for (let i = 0; i < results.length; i++) {
            const object = results[i];

            var opt = document.createElement('option');
            opt.value = object.id;
            opt.innerHTML = object.get("folder_name");

            select3.appendChild(opt);
        }
    }
}

getFolders();