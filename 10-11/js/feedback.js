// feedback script
var button = document.getElementById('feedbackButton')
var feedbackField = document.getElementById('feedback')
var useLocalStorage = false
var condition = "online";

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

window.addEventListener('online', function(e) {
  condition = "online";
  console.log(condition)
  takeFromStorage()
});
window.addEventListener('offline', function(e) {
  condition = "offline";
  console.log(condition)
});

function takeFromStorage() {
  if (useLocalStorage) {
    var data = JSON.parse(localStorage.getItem('feedbacks'))
    for (var i = 0; i < data.length; i++) {
      console.log(data[i]);
    var feedback = '<div class="feedback"><h2>'+ data[i].author +'</h2><span>'+ data[i].date +'</span><p>'+ data[i].text +'</p></div>'
    }
    var feedbacks= document.getElementById('feedbacksWrap')
    var feedbackWrap = document.createElement('div')
    feedbackWrap.innerHTML = feedback
      feedbacks.appendChild(feedbackWrap)
    localStorage.removeItem('feedbacks')
  }
}

button.addEventListener('click', function() {
    var feedbackFieldValue = feedbackField.value;

    if(feedbackFieldValue.length == 0){
      window.alert('Please fill the field');
    }
    else{
      if (condition=='online') {
        var feedback = '<div class="feedback"><h2> Вася Петькін</h2><span>'+ new Date().toDateString() +'</span><p>'+ feedbackField.value+'</p></div>'
        var feedbacks= document.getElementById('feedbacksWrap')
        var feedbackWrap = document.createElement('div')
        feedbackWrap.innerHTML = feedback
        feedbacks.appendChild(feedbackWrap)
        feedbackField.value = ''
      }
      else{
        function addFeedback() {
          class Feedback {
            constructor(text, author, date) {
              this.text = text;
              this.author = author;
              this.date = date;
            }
          }
          var date = new Date().toDateString();
          var feedbacks = new Feedback(feedbackField.value, 'Вася Петькін',date);
           addToStorage(feedbacks);
          alert('Article sent!');
          feedbackField.value = ''
        }
        addFeedback()
      }

      function sendToServer() {
        if(useLocalStorage){
          localStorage.clear()
        }
        else{
          const dbName = "Storage";
          var open = indexedDB.open(dbName);
          open.onsuccess = function() {
            var db = open.result;
            var tx = db.transaction("Feedbacks", "readwrite");
            var store = tx.objectStore("Feedbacks");
            var objectStoreRequest = store.clear();
        }
        }
      }

      function addToStorage(feedbacksItem) {
        feedbacks = []
        feedbacks.push(feedbacksItem)
        if (useLocalStorage) {
          localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        } else {
          const dbName = "Storage";
          var open = indexedDB.open(dbName);
          open.onupgradeneeded = function() {
            var db = open.result;
            var store = db.createObjectStore("Feedbacks", {keyPath: "date"});
          };
          open.onsuccess = function() {
            var db = open.result;
            var tx = db.transaction("Feedbacks", "readwrite");
            var store = tx.objectStore("Feedbacks");
            store.put(feedbacksItem)
        }
        }
        return false;
      }
    }
 });
