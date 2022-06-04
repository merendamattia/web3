/* LOGIN */
logIn = async () => {
    let user = Moralis.User.current();
    if (!user) {
        // controllo se l'utente è connesso dal cellulare o pc
        if (typeof screen.orientation === 'undefined') {
            // cellulare
            const user = await Moralis.authenticate({
                provider: "walletconnect",
                signingMessage: "Login - Portale archiviazione dati su IPFS by merendamattia.com (mobile version)",
                mobileLinks: [
                    "rainbow",
                    "metamask",
                    "argent",
                    "trust",
                    "imtoken",
                    "pillar",
                ]
            }).then(function (user) {
                checkUser();
                //location.reload();
            }).catch(function (error) {
                changeValue("error", "<b>Error:</b> " + error.message + "<br><b>Code:</b> " + error.code);
                console.log(error);
            });
        } else {
            // pc
            user = await Moralis.authenticate({
                signingMessage: "Login - Portale archiviazione dati su IPFS by merendamattia.com (desktop version)",
                /*provider: "walletconnect", 
                signingMessage: "Login - Portale archiviazione dati su IPFS by merendamattia.com (desktop version)",
                mobileLinks: [
                  "rainbow",
                  "metamask",
                  "argent",
                  "trust",
                  "imtoken",
                  "pillar",
                ]*/
            }).then(function (user) {
                checkUser();
                //location.reload();
            }).catch(function (error) {
                changeValue("error", "<b>Error:</b> " + error.message + "<br><b>Code:</b> " + error.code);
                console.log(error);
            });
        }
    }
}

logInWC = async () => {
    let user = Moralis.User.current();
    if (!user) {
        // controllo se l'utente è connesso dal cellulare o pc
        if (typeof screen.orientation === 'undefined') {
            // cellulare
            const user = await Moralis.authenticate({
                provider: "walletconnect",
                signingMessage: "Login - Portale archiviazione dati su IPFS by merendamattia.com (mobile version)",
                mobileLinks: [
                    "rainbow",
                    "metamask",
                    "argent",
                    "trust",
                    "imtoken",
                    "pillar",
                ]
            }).then(function (user) {
                checkUser();
                //location.reload();
            }).catch(function (error) {
                changeValue("error", "<b>Error:</b> " + error.message + "<br><b>Code:</b> " + error.code);
                console.log(error);
            });
        } else {
            // computer
            const user = await Moralis.authenticate({
                provider: "walletconnect",
                signingMessage: "Login - Portale archiviazione dati su IPFS by merendamattia.com (desktop version)",
                mobileLinks: [
                    "rainbow",
                    "metamask",
                    "argent",
                    "trust",
                    "imtoken",
                    "pillar",
                ]
            }).then(function (user) {
                checkUser();
                //location.reload();
            }).catch(function (error) {
                changeValue("error", "<b>Error:</b> " + error.message + "<br><b>Code:</b> " + error.code);
                console.log(error);
            });
        }
    }
}


document.getElementById("login_button").onclick = logIn;
document.getElementById("login_wc").onclick = logInWC;