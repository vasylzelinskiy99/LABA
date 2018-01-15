var useLocalStorage = false;

function switchUseLS(){
	useLocalStorage = !useLocalStorage;
}

function isOnline() {
	return window.navigator.onLine; 
}

class Feedback{
	constructor(name, feedback, date){
		this.name = name;
		this.feedback = feedback;
		this.date = date;
	}
}

function addToStorage(feedback){
	if(useLocalStorage){
		var feedbacks = new Array;
		var feedback_item = localStorage.getItem('feedbacks');
	    if (feedback_item !== null) {
	        feedbacks = JSON.parse(feedback_item); 
	    }
	    feedbacks.push(feedback);
	    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
	    return false;
	} else{
		var openDB = indexedDB.open("feedback", 1);

		openDB.onerror = function(event) {
		  alert("Error occurred when loading feedback");
		};
		openDB.onsuccess = function(event) {
			var db = openDB.result;
			var tx = db.transaction(["feedbacks"], "readwrite");
			var store = tx.objectStore("feedbacks");
			var addFeedback = store.put(feedback);
			addFeedback.onsuccess = function(event){
				alert("Feedback created");
			}
			addFeedback.onerror = function(event){
				alert("Error occurred when loading feedbacks");
			}
			tx.oncomplete = function(){
				db.close();
			}
		};
	}
}

function showLocalInfo(){
	if(useLocalStorage){
	    var feedback_item = localStorage.getItem('feedbacks');
	    if (feedback_item !== null) {
	        feedbacks = JSON.parse(feedback_item); 
	    }
	    if ((typeof feedbacks !== 'undefined') && (feedbacks.length > 0)) {
		    for(var i = 0; i < feedbacks.length; i++) {
	    		createFeedback(feedbacks[i]);
		    }
		}
	} else{
		var openDB = indexedDB.open("feedback", 1);
		openDB.onupgradeneeded = function() {
		    var db = openDB.result;
		    var store = db.createObjectStore("feedbacks", {keyPath: "name"});
		    store.createIndex("name", "name", { unique: false });
		    store.createIndex("feedback", "feedback", { unique: false });
		    store.createIndex("date", "date", { unique: false });
		}
		openDB.onsuccess = function(event) {
			var db = openDB.result;
			var tx = db.transaction("feedbacks", "readwrite");
	    	var store = tx.objectStore("feedbacks");
	    	store.openCursor().onsuccess = function(event) {
				var cursor = event.target.result;
				if (cursor) {
					var tempFeed = new Feedback(cursor.value.name, cursor.value.feedback, cursor.value.date);
				  	createFeedback(tempFeed);
				  	cursor.continue();
				}
			};
	    	tx.oncomplete = function(){
	    		db.close();
	    	}
		}
	}
}

function addFeedback(){
	var feedbackText = document.getElementById("comment");
	var nameText = document.getElementById("name");
	var date = new Date();
	if(nameText.value == ""){
		alert("Вкажіть ваше ім'я");
		return;
	}
	if(feedbackText.value == ""){
		alert("Порожній відгук!");
		return;
	}
	var feedback = new Feedback(nameText.value, feedbackText.value, date);
	addToStorage(feedback);
	createFeedback(feedback);
	feedbackText.value = "";
	nameText.value = "";
}

function createFeedback(feedback){
	
	var responseField = document.getElementById("newResponseField");
	var element = document.getElementById("responses");

	var date = new Date(feedback.date);
	var nameText = feedback.name;
	var responseText = feedback.feedback;
	var dateString = date.getDate() + "." + (date.getMonth() + 1) + "." + (date.getFullYear())
		+ ", " + date.getHours() + ":" + date.getMinutes();

	var responseRow = document.createElement("div");
	responseRow.innerHTML = '<div class="row"><div class = col-lg><p><span class="h2 pull-left">'+ nameText + ' ' + 
	'</span><span><i>' + dateString + '</i></span></p><p>' + responseText + '</p></div></div><hr>';

	element.insertBefore(responseRow, responseField);
}