async function verifyNFT(){
    let user = Moralis.User.current();
    //document.getElementById("checkNFT").title = "NFT check...";

    const ad = user.get("ethAddress");
    //const ad = "0x49A944eE3277F793976989017eAd54a4150c2617"; //address persona a caso che ha NFT

    const options = { address: ad };

    const nfts = await Moralis.Web3.getNFTs(options);

    console.log(nfts);

    //const addressNFT = "0x64b6b4142d4d78e49d53430c1d3939f2317f9085"; // address NFT a caso
    const addressNFT = "xxx";

    var verify = false;

    nfts.forEach(function(nft){
        if(addressNFT === nft.token_address) verify = true;
        console.log(verify, addressNFT, nft.token_address);
    });

    if(verify === true){
        document.getElementById("checkNFT").innerHTML = "✅ NFT";
        document.getElementById("checkNFT").title = "🔥 NFT verified!";
    } 
    else{
        document.getElementById("checkNFT").innerHTML = "❌ NFT";
        document.getElementById("checkNFT").title = "NFT not found!";
    }
        
}

$(function () {
    $("[rel='tooltip']").tooltip();
});

