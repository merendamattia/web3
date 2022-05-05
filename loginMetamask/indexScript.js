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
            window.location.replace("./logged.html");
            //connected(user);
            console.log("logged in user:", user);
            console.log("Address: " + user.get("ethAddress"));
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  
document.getElementById("login").onclick = logIn;



function init() { 
  if (Moralis.User.current()) window.location.replace("./logged.html");
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