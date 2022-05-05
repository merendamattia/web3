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
            window.location.replace("pages/logged.html");
            console.log("Address: " + user.get("ethAddress"));
        })
        .catch(function (error) {
            var str = "<b>Error:</b> " + error.message + "<br>";
            str += "<b>Code:</b> " + error.code;
            changeValue("error", str);
            console.log(error);
        });
    }
}
  
document.getElementById("login").onclick = logIn;

function init() { 
  if (Moralis.User.current()) window.location.replace("pages/logged.html");
}

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }