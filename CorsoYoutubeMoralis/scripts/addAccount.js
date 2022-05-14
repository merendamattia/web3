let user = Moralis.User.current();

const Monster = Moralis.Object.extend("USER_SIGNED");
const monster = new Monster();
        
monster.set("address", user.get("ethAddress"));
monster.set("username", localStorage.getItem("name"));

monster.save().then(
    (monster) => {
            // Execute any logic that should take place after the object is saved.
        alert("New object created with objectId: " + monster.id);
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

console.log(localStorage.getItem("name"));
window.location.replace("../index.html");



