function getOP_RETURN(y){
    return y.substring(y.indexOf("OP_RETURN") + 10, y.indexOf("OP_RETURN") + 160);
}

function fetch_op_return(hash){
    let explorer = "https://explorer.btc.com/btc/transaction/"

    var hash_length = hash.length;

    for(var i = 0; i < hash_length; i++){
        let file = explorer + hash[i];
        fetch (file)
        .then(x => x.text())
        .then(y => document.getElementById("demo").innerHTML += (hex_to_text(y) + "<br>"));
    }
    
}

function hex_to_ascii(str1){
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) 
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	return str;
}

function hex_to_text(y){
    var hex = getOP_RETURN(y);
    return hex_to_ascii(hex).replace(/[^a-zA-Z0-9 ]/g, '');
}

function main(){
    fetch ("hash.txt")
    .then(x => x.text())
    .then(y => fetch_op_return(y.split(/\r?\n/))
    );
}

main();