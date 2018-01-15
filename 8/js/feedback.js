function isOnline() {
	return window.navigator.onLine; 
}

class Response{
	constructor(name, response, date){
		this.name = name;
		this.response = response;
		this.date = date;
	}
}

function addToStorage(response){
	var responses = getResponses();
    responses.push(response);
    localStorage.setItem('responses', JSON.stringify(responses));
    //show();
    return false;
}

function getResponses() {
    var responses = new Array;
    var response_item = localStorage.getItem('responses');
    if (response_item !== null) {
        responses = JSON.parse(response_item); 
    }
    return responses;
}

function show(){
	if(isOnline()){
		//server stuff
	}
	var responses = getResponses();
    if ((typeof responses !== 'undefined') && (responses.length > 0)) {
	    for(var i = 0; i < responses.length; i++) {
    		createResponse(responses[i]);
	    }
	}
}

function addResponse(){
	var responseText = document.getElementById("comment");
	var nameText = document.getElementById("name");
	var date = new Date();
	if(nameText.value == ""){
		alert("Вкажіть ваше ім'я");
		return;
	}
	if(responseText.value == ""){
		alert("Порожній відгук!");
		return;
	}
	var response = new Response(nameText.value, responseText.value, date);
	if(isOnline()){
		//server stuff
	}
	addToStorage(response);
	createResponse(response);
	responseText.value = "";
	nameText.value = "";
}

function createResponse(response){
	
	var responseField = document.getElementById("newResponseField");
	var element = document.getElementById("responses");

	var date = new Date(response.date);
	var nameText = response.name;
	var responseText = response.response;
	var dateString = date.getDate() + "." + (date.getMonth() + 1) + "." + (date.getFullYear())
		+ ", " + date.getHours() + ":" + date.getMinutes();


	var responseRow = document.createElement("div");
	responseRow.setAttribute("class", 'row');
	var responseCol = document.createElement("div");
	responseCol.setAttribute("class", "col-lg");
	var responseHeader = document.createElement("p");
	var responseFill = document.createElement("p");
	var responseHeaderName = document.createElement("span");
	responseHeaderName.setAttribute("class", "h2 pull-left");
	var responseHeaderDate = document.createElement("span");
	var responseHeaderDateItalic = document.createElement("i");
	responseHeaderDateItalic.innerHTML = dateString;
	responseHeaderName.innerHTML = nameText + " ";
	responseFill.innerHTML = responseText;

	responseHeaderDate.appendChild(responseHeaderDateItalic);
	responseHeader.appendChild(responseHeaderName);
	responseHeader.appendChild(responseHeaderDate);
	responseCol.appendChild(responseHeader);
	responseCol.appendChild(responseFill);
	responseRow.appendChild(responseCol);

	element.insertBefore(responseRow, responseField);
	element.insertBefore(document.createElement("hr"), responseField);
}