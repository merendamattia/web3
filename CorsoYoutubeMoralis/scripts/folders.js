function createFolder(){
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

async function getFolders(){
    const Monster = Moralis.Object.extend("USER_FOLDERS");
    const query = new Moralis.Query(Monster);
 
    query.equalTo("address", user.get("ethAddress"));

    const results = await query.descending("updatedAt").find();
    var select1 = document.getElementById('folder1');
    var select2 = document.getElementById('folder2');

    if(results.length !== 0) {
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
    }
}

getFolders();