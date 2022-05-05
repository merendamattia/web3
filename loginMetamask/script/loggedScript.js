/* Moralis init code */
const serverUrl = "https://kpzk5mc6vpt0.usemoralis.com:2053/server";
const appId = "ubDzdHNV8MsCnI8Dsp0Vai6ZwzmZyRHq2dhZpd2d";
Moralis.start({ serverUrl, appId });

changeValue("connection", "Connected - " + Moralis.User.current().get("ethAddress"));

if (!Moralis.User.current()) window.location.replace("../index.html");

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

    /**
     * ToDo
     */
    /*async function go() {//<button id="btn-go">go</button>
        const currentUser = Moralis.User.current();
        
        if (currentUser) {
            console.log("Address: " + currentUser.get("ethAddress"));
        
            const first = new Moralis.Query("test1");
            first.equalTo("address", currentUser.get("ethAddress"));
            first.find().then(function (connections){
            const count = first.get("text");
            alert(connections.get("text"));
            //link tutorial - https://youtu.be/2CaHZhgtsZc
            })
            .catch(function (error){
            alert("Non trovato");
            });

        } else {
        alert("Metamask not connected!!")
        }
    }
    //document.getElementById("btn-go").onclick = go;
        */

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

document.getElementById("logout").onclick = logOut;
document.getElementById("upload").onclick = uploadAll;
