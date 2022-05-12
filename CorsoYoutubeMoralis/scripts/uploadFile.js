function addLinkToDB(link, hash){
    let user = Moralis.User.current();

    const Monster = Moralis.Object.extend("USER_IPFS");
    const monster = new Monster();
            
    monster.set("address", user.get("ethAddress"));
    monster.set("link_ipfs", link);
    monster.set("hash_ipfs", hash);

    monster.save().then(
        (monster) => {
            // Execute any logic that should take place after the object is saved.
            alert("File caricato: " + monster.id);
            //window.location.replace("index.html");
        },
        (error) => {
            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            //changeValue("result", "Errore: Account non registrato!");
            //changeValue("error", error.message);
            alert("Failed to create new object, with error code: " + error.message);
        }
    );
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
    
    addLinkToDB(file.ipfs(), file.hash());

    var res = "<br>IPFS: <a href = '" + file.ipfs() + "' target = '_blank'>link</a>";
    res += "<br>HASH: " + file.hash();

    changeValue("result", res);
}
    
uploadAll = async () => {
    changeValue("result", "Uploading... please wait!");
    const image = await uploadImage();
    await uploadMetadata(image);
}

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

document.getElementById("upload").onclick = uploadAll;




