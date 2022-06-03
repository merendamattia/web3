// Corso di 6h:  https://youtu.be/MY4WYoZPr-U

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

function getLinkIpfs(hash) {
    var url = "https://gateway.moralisipfs.com/ipfs/" + hash;
    return url;
}

checkUser();

async function getProfileData(user) {
    const Monster = Moralis.Object.extend("USER_PHOTO");
    const query = new Moralis.Query(Monster);

    query.equalTo("address", user.get("ethAddress"));

    const results = await query.find();


    const object = results[0];
    var ris = "";

    if (object.get("image_hash") !== 'undefined') {
        var linkImg = getLinkIpfs(object.get("image_hash"));
        ris += "<img class = 'profile-img' src = '" + linkImg + "' alt='Foto profilo'>";
    }

    if (object.get("username") !== 'undefined')
        ris += "<p>" + object.get("username") + "</p>";

    changeValue("profileData", ris);
}
