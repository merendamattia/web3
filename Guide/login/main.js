/* Moralis init code */
const serverUrl = "YOUR_SERVER_URL";
const appId = "YOUR_APPLICATION_ID";
Moralis.start({ serverUrl, appId });

document.getElementById("btn-login").onclick = logIn;
document.getElementById("btn-logout").onclick = logOut;

/* Authentication code */
logIn = async () => {

    let user = Moralis.User.current();

    if (!user) {
      user = await Moralis.authenticate({
        signingMessage: "Test Log in using Moralis by merendamattia.com",
      })
        .then(function (user) {
          // Do something
          alert("User logged! - Address: " + user.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
  
  logOut = async () => {
    Moralis.User.logOut().then(() => {
      const currentUser = Moralis.User.current();  // this will now be null
      alert("User logged out! - Bye Bye");
    });
  }
