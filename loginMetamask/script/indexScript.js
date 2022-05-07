init();

/* Authentication code */
logIn = async () => {

    let user = Moralis.User.current();

    if (!user) {
        user = await Moralis.authenticate({
            signingMessage: "Test Log in using Moralis by merendamattia.com",
        })
        .then(function (user) {
            isSigned(user);
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
    const serverUrl = "https://kpzk5mc6vpt0.usemoralis.com:2053/server";
    const appId = "ubDzdHNV8MsCnI8Dsp0Vai6ZwzmZyRHq2dhZpd2d";
    Moralis.start({ serverUrl, appId });

    if (Moralis.User.current()) window.location.replace("pages/logged.html");
}

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

isSigned = async (user) =>{
    if (user) {
        const Monster = Moralis.Object.extend("Users");
        const query = new Moralis.Query(Monster);

        query.equalTo("address", user.get("ethAddress"));

        const results = await query.find();
        alert(results.length);

        localStorage.setItem('address', user.get("ethAddress"));
        
        if(results.length !== 0) window.location.replace("pages/logged.html");
        else window.location.replace("pages/signin.html");
    } 
    else alert("Metamask not connected!!")
}