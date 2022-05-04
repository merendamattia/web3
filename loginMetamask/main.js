/* Moralis init code */
const serverUrl = "https://kpzk5mc6vpt0.usemoralis.com:2053/server";
const appId = "ubDzdHNV8MsCnI8Dsp0Vai6ZwzmZyRHq2dhZpd2d";
Moralis.start({ serverUrl, appId });

init();

/* Authentication code */
logIn = async () => {
    let user = Moralis.User.current();
    if (!user) {
      user = await Moralis.authenticate({
        signingMessage: "Test Log in using Moralis by merendamattia.com",
      })
        .then(function (user) {
          connected(user);
          console.log("logged in user:", user);
          console.log("Address: " + user.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
  
  logOut = async () => {
    Moralis.User.logOut().then(() => {
      const currentUser = Moralis.User.current();  // this will now be null
      console.log("logged out");
      disconnected();
      location.reload();
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

  
  async function go() {//<button id="btn-go">go</button>
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
  
document.getElementById("btn-login").onclick = logIn;
document.getElementById("btn-logout").onclick = logOut;
//document.getElementById("btn-go").onclick = go;
document.getElementById("upload").onclick = uploadAll;

  
function showDiv(id) { document.getElementById(id).style.display = "block"; }
function hideDiv(id) { document.getElementById(id).style.display = "none"; }

function init() { 
  const currentUser = Moralis.User.current();
  if (currentUser) connected(currentUser);
  else disconnected(); 
}
function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

function disconnected(){
  hideDiv("auth");
  hideDiv("btn-logout");

  changeValue("connection", "Not connected");
}

function connected(currentUser){
  showDiv("auth");
  showDiv("btn-logout");
  hideDiv("btn-login");

  changeValue("connection", "Connected - " + currentUser.get("ethAddress"));
  //changeValue("address", "address: " + currentUser.get("ethAddress"));
}

/*
const interval = setInterval(function() {
  const currentUser = Moralis.User.current();
  if (currentUser) connected(currentUser);
  else disconnected();
}, 100);
*/

//const web3Provider = await Moralis.enableWeb3();