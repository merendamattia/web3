init();

logOut = async () => {
    Moralis.User.logOut().then(() => {
    console.log("logged out");
    window.location.replace("../index.html");
    })
    .catch(function (error) {
        var str = "<b>Error:</b> " + error.message + "<br>";
        str += "<b>Code:</b> " + error.code;
        changeValue("error", str);
        console.log(error);
      });
}

uploadImage = async () => {
    const fileInput = document.getElementById("image");
    const data = fileInput.files[0];
    const file = new Moralis.File(data.name, data);
    await file.saveIPFS();

    console.log(file.ipfs(), file.hash())

    return file.ipfs();
}

uploadMetadata = async (imageURL) => {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;

    const metadata = {
        "name": name,
        "description": description,
        "image": imageURL
    };

    //changeValue("result", new String(metadata));

    const file = new Moralis.File("file.json", {
        base64: btoa(JSON.stringify(metadata)),
    });

    await file.saveIPFS();

    console.log(file.ipfs(), file.hash());

    var res = "<br>IPFS: " + file.ipfs();
    res += "<br>HASH: " + file.hash();

    changeValue("result", res);
}
    
uploadAll = async () => {
    changeValue("result", "Uploading... please wait!");
    const image = await uploadImage();
    await uploadMetadata(image);
}

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

document.getElementById("logout").onclick = logOut;
document.getElementById("upload").onclick = uploadAll;

function init() { 
    const serverUrl = "https://kpzk5mc6vpt0.usemoralis.com:2053/server";
    const appId = "ubDzdHNV8MsCnI8Dsp0Vai6ZwzmZyRHq2dhZpd2d";
    Moralis.start({ serverUrl, appId });

    if(localStorage.getItem('address') === Moralis.User.current().get("ethAddress"))
        changeValue("connection", "Connected - " + Moralis.User.current().get("ethAddress"));
    else {
        delete localStorage.address;
        window.location.replace("../index.html")
    }
    
    if (!Moralis.User.current()) window.location.replace("../index.html");
}

// ---------------------------- Sviluppo

/**
 * Effettua una query
 * Ritorna i record che hanno l'address uguale
 */
 async function go() {
    // doc: https://docs.moralis.io/moralis-dapp/database/queries
    const currentUser = Moralis.User.current();
        
    if (currentUser) {
         console.log("Address: " + currentUser.get("ethAddress"));
            
        const Monster = Moralis.Object.extend("test1");
        const query = new Moralis.Query(Monster);

        query.equalTo("address", currentUser.get("ethAddress"));

        const results = await query.find();
        
        alert("Successfully retrieved " + results.length + " monsters.");
        
        // Do something with the returned Moralis.Object values
        
        for (let i = 0; i < results.length; i++) {
            const object = results[i];
            alert(object.id + " - " + object.get("text"));
        }

    } else {
        alert("Metamask not connected!!")
    }
}
document.getElementById("go").onclick = go;


async function add() {
    const Monster = Moralis.Object.extend("test1");
    const monster = new Monster();

    monster.set("linkIPFS", "scemo chi legge");
    monster.set("address", Moralis.User.current().get("ethAddress"));
    monster.set("text", "questa è una provola");

    monster.save().then(
        (monster) => {
            // Execute any logic that should take place after the object is saved.
            alert("New object created with objectId: " + monster.id);
        },
        (error) => {
            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            alert("Failed to create new object, with error code: " + error.message);
        }
    );
}

document.getElementById("add").onclick = add;