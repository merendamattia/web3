let user = Moralis.User.current();
if (!user) window.location.replace("../index.html"); 
let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }
        
async function uploadImg() {
    const image = document.getElementById("imageProfile");
    //const username = document.getElementById("username").value;
    let user = Moralis.User.current();
    const data = image.files[0];

    if(image.files.length != 0){
        const loadGif = "<div class='spinner-border text-warning' role=status'><span class='visually-hidden'>Loading...</span></div>";
        changeValue("result", loadGif);
        const file = new Moralis.File(data.name, data);
        await file.saveIPFS();
        const MonsterCreature = Moralis.Object.extend('USER_PHOTO');
        const query = new Moralis.Query(MonsterCreature);
        query.equalTo("address", user.get("ethAddress"));  
        const monster = await query.first();
        monster.set("image_hash", file.hash());
        monster.save().then(
            (monster) => {
                alert("Foto profilo aggiornata!! 🥳");
                location.reload();
            },
            (error) => {
                alert("Errore nel caricamento del file. Riprovare. 😢");
            });
        console.log(monster, file.ipfs());
    }
}

function uploadImage(){
    uploadImg(); 
}

async function uploadUser() {
    const username = document.getElementById("username").value;
    //const username = document.getElementById("username").value;
    let user = Moralis.User.current();
    
    const loadGif = "<div class='spinner-border text-warning' role=status'><span class='visually-hidden'>Loading...</span></div>";
    changeValue("result", loadGif);
        
    const MonsterCreature = Moralis.Object.extend('USER_PHOTO');
    const query = new Moralis.Query(MonsterCreature);
    query.equalTo("address", user.get("ethAddress"));  
    const monster = await query.first();
    monster.set("username", username);
    monster.save().then(
        (monster) => {
            alert("Username aggiornato!! 🥳");
            location.reload();
        },
        (error) => {
            alert("Errore nella modifica dell'username. Riprovare. 😢");
        });
    
}

function uploadUsername(){
    uploadUser(); 
}

function getLinkIpfs(hash){
    var url = "https://gateway.moralisipfs.com/ipfs/" + hash;
    return url;
}

check();

async function check(){
    let user = Moralis.User.current();

    var address = user.get("ethAddress");
    var newAddress = "";
    if(isMobile)
        newAddress = address.substring(0,5) + ".." + address.substring(address.length - 4, address.length);
    else
        newAddress = address.substring(0,4) + ".." + address.substring(address.length - 3, address.length);
            
    changeValue("address", newAddress);
    document.getElementById("addressUser").title = address;

    const Monster = Moralis.Object.extend("USER_PHOTO");
    const query = new Moralis.Query(Monster);

    query.equalTo("address", user.get("ethAddress"));

    const results = await query.find();
        //alert(results.length);

    if(results.length === 0) {
    
        const monster = new Monster();
                    
        monster.set("address", user.get("ethAddress"));   
        monster.setACL(new Moralis.ACL(Moralis.User.current()));

        monster.save().then(
            (monster) => {
                    // Execute any logic that should take place after the object is saved.
                console.log("Account aggiunto a USER_PHOTO");
            },
            (error) => {
                console.log("Errore - Account non aggiunto a USER_PHOTO");
            }
        );
    } else {
        if (user) {
        const Monster = Moralis.Object.extend("USER_PHOTO");
        const query = new Moralis.Query(Monster);

        query.equalTo("address", user.get("ethAddress"));

        const results = await query.find();
            
        const object = results[0];
        var ris = "";

        if(object.get("image_hash") !== "undefined" && object.get("image_hash") !== ""){
            console.log(object.get("image_hash"));
            var linkImg = getLinkIpfs(object.get("image_hash"));
            ris += "<img class='profile-img' src = '" + linkImg + "' alt='Foto profilo'>";
        }
        
        if(object.get("username") !== 'undefined' || object.get("username") !== '')
            ris += "<p>" + object.get("username") + "</p>";

        changeValue("profileData", ris);
    }
    }
    
}

