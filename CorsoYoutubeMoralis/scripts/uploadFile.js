function addLinkToDB(imgName, imgDescription, fileType, imgHash, link, hash){
    let user = Moralis.User.current();

    const Monster = Moralis.Object.extend("USER_IPFS");
    const monster = new Monster();
            
    monster.set("address", user.get("ethAddress"));
    monster.set("link_ipfs", link);
    monster.set("hash_ipfs", hash);
    monster.set("ImgName", imgName);
    monster.set("ImgDescription", imgDescription);
    monster.set("ImgHash", imgHash);
    monster.set("fileType", fileType);

    monster.save().then(
        (monster) => {
            // Execute any logic that should take place after the object is saved.
            alert("File caricato!! 🥳");
            location.reload();
        },
        (error) => {
            alert("Errore nel caricamento del file. Riprovare. 😢");
        }
    );
}


uploadImage = async () => {
    const fileInput = document.getElementById("image");
    const data = fileInput.files[0];
    const file = new Moralis.File(data.name, data);
    await file.saveIPFS();

    console.log(file.ipfs(), file.hash())

    return file.hash();
}

uploadMetadata = async (imageHash) => {
    const nameImg = document.getElementById("nameImg").value;
    const description = document.getElementById("description").value;
    const fileType = document.getElementById("fileType").value;

    const metadata = {
        "name": nameImg, 
        "description": description, 
        "file": "https://gateway.moralisipfs.com/ipfs/" + imageHash
    };

    //changeValue("result", new String(metadata));

    const file = new Moralis.File("file.json", {
        base64: btoa(JSON.stringify(metadata)),
    });

    console.log(file);

    await file.saveIPFS();

    console.log(file.ipfs(), file.hash());
    
    addLinkToDB(nameImg, description, fileType, imageHash, file.ipfs(), file.hash());

    var res = "File caricato! Aggiornare la pagina";
    // var res = "<br>IPFS: <a href = '" + file.ipfs() + "' target = '_blank'>link</a>";
    // res += "<br>HASH: " + file.hash();

    changeValue("result", res);
}
    
uploadAll = async () => {
    const fileInput = document.getElementById("image");

    const loadGif = "<div class='spinner-border text-warning' role=status'><span class='visually-hidden'>Loading...</span></div>";

    if(fileInput.files.length != 0){
        changeValue("result", loadGif);
        const image = await uploadImage();
        await uploadMetadata(image);
    } else {
        changeValue("result", "Selezionare un file!!");
    }
    
}

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

document.getElementById("upload").onclick = uploadAll;




