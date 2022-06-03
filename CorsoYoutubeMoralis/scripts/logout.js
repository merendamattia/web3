/* LOGOUT */
logOut = async () => {
    Moralis.User.logOut();
    console.log("User logged out!");
    alert("Logout effettuato correttamente. Alla prossima! ☺️");
    //checkUser();
    //localStorage.clear();
    location.reload();
}

document.getElementById("logout_button").onclick = logOut;


// RISOLVE UN BUG PER UTENTI IOS
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        window.localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE');
    }
});