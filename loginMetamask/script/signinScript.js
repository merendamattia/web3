init();

signIn = async () => {

    let user = Moralis.User.current();
    //console.log(user);
    add(user);/*
        var user = await Moralis.authenticate({
            signingMessage: "Please confirm your subscription! Made by merendamattia.com",
        })
        .then(function (user) {
            add(user);
        })
        .catch(function (error) {
            var str = "<b>Error:</b> " + error.message + "<br>";
            str += "<b>Code:</b> " + error.code;
            changeValue("error", str);
            console.log(error);
            add(Moralis.User.current());
        });
    */
}

document.getElementById("signIn").onclick = signIn;

function init() { 
    const serverUrl = "https://kpzk5mc6vpt0.usemoralis.com:2053/server";
    const appId = "ubDzdHNV8MsCnI8Dsp0Vai6ZwzmZyRHq2dhZpd2d";
    Moralis.start({ serverUrl, appId });

    //if (Moralis.User.current()) window.location.replace("pages/logged.html");
}

function add(user) {
    const Monster = Moralis.Object.extend("Users");
    const monster = new Monster();
    
    monster.set("address", user.get("ethAddress"));
    monster.set("name", document.getElementById("name"));

    monster.save().then(
        (monster) => {
            // Execute any logic that should take place after the object is saved.
            alert("New object created with objectId: " + monster.id);
            changeValue("result", "Account registrato!");
        
        },
        (error) => {
            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            changeValue("error", error.message);
            alert("Failed to create new object, with error code: " + error.message);
        }
    );
}

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }