
function start(){
	var myJSON = '{ "name":"John", "age":31, "city":"New York" }';
var myObj = JSON.parse(myJSON);
console.log(myObj.name);
document.getElementById("demo").innerHTML = myObj.name;
}
