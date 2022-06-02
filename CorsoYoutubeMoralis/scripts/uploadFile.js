function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

// ------------------------------------- Inserimento dati nel database
function addLinkToDB(imgName, imgDescription, fileType, imgHash, link, hash, folder){
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
    monster.set("folder", folder);
    monster.setACL(new Moralis.ACL(Moralis.User.current()));

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

// ------------------------------------- Upload file
uploadImage = async () => {
    const nameImg = document.getElementById("nameImg").value;
    const fileInput = document.getElementById("image");
    const data = fileInput.files[0];
    const file = new Moralis.File(nameImg, data);
    await file.saveIPFS();

    console.log(file.ipfs(), file.hash())

    return file.hash();
}

// ------------------------------------- Upload metadata
uploadMetadata = async (imageHash) => {
    const nameImg = document.getElementById("nameImg").value;
    const description = document.getElementById("description").value;
    const fileType = document.getElementById("fileType").value;
    const folder = document.getElementById("folder2").value;

    const metadata = {
        "name": nameImg, 
        "description": description, 
        "type": fileType,
        //"file": "https://gateway.moralisipfs.com/ipfs/" + imageHash
        "file": imageHash
    };

    //changeValue("result", new String(metadata));

    const file = new Moralis.File("file.json", {
        base64: btoa(JSON.stringify(metadata)),
    });

    console.log(file);

    await file.saveIPFS();

    console.log(file.ipfs(), file.hash());
    
    addLinkToDB(nameImg, description, fileType, imageHash, file.ipfs(), file.hash(), folder);

    var res = "File caricato! Aggiornare la pagina";
    // var res = "<br>IPFS: <a href = '" + file.ipfs() + "' target = '_blank'>link</a>";
    // res += "<br>HASH: " + file.hash();

    changeValue("result", res);
}

// ------------------------------------- Verifica se un utente ha già caricato file
async function checkIfExist(){
    const data = image.files[0];
    const file = new Moralis.File(data.name, data);
    await file.saveIPFS();

    let user = Moralis.User.current();

    const Monster = Moralis.Object.extend("USER_PHOTO");
    const query = new Moralis.Query(Monster);

    query.equalTo("address", user.get("ethAddress"));

    const results = await query.find();
        //alert(results.length);

    if(results.length === 0) {
    
        const monster = new Monster();
                    
        monster.set("address", user.get("ethAddress"));   
        monster.setACL(new Moralis.ACL(Moralis.User.current()));

        monster.save().then(
            (monster) => {
                    // Execute any logic that should take place after the object is saved.
                console.log("Account aggiunto a USER_PHOTO");
            },
            (error) => {
                console.log("Errore - Account non aggiunto a USER_PHOTO");
            }
        );
    } else {
        console.log("Account già presente in USER_PHOTO");
    }
}
    
// ------------------------------------- MAIN
uploadAll = async () => {
    const fileInput = document.getElementById("image");

    checkIfExist();

    const loadGif = "<div class='spinner-border text-warning' role=status'><span class='visually-hidden'>Loading...</span></div>";
    const bar = "<div class='progress'><div id = 'bar' style = 'width: 0%;' class = 'progress-bar progress-bar-striped bg-warning' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div></div>";

    if(fileInput.files.length != 0 && document.getElementById("fileType").value !== "Tipo" && document.getElementById("nameImg").value !== ""){
        
        changeValue("result", bar);
        
        var timer = setInterval(function (){
            var rap = 1 / (filesize + 10) * 100;
            //console.log("rap: " + rap);
        
            percentuale += rap;
            console.log("percentuale: " + percentuale);
            
            document.getElementById("bar").style.width = percentuale + "%";
        }, 1000);

        try{
            const image = await uploadImage();
            await uploadMetadata(image);
        } catch (error){
            console.log(error);
            window.clearInterval(timer);
        }
            
    } else {
        changeValue("result", "Devi compilare tutti i campi!!");
    }
    
}

document.getElementById("upload").onclick = uploadAll;

var percentuale = 0;
var filesize = 0;
console.log("upload filesize: " + filesize);

document.getElementById("image").onchange = () => {
    filesize = document.getElementById("image").files[0].size / 1000000;  //QUESTA MERDA è IN KILOBYTE
    console.log("filesize: " + filesize + " MB");
   //alert((filesize / 1000) + "MB");
}