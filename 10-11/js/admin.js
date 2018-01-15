//news script

var newsButton = document.getElementById('sendArticle')
var articleField = document.getElementById('article')
var title = document.getElementById('title')
var image = document.getElementById('inputfile')
var useLocalStorage = false

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

window.addEventListener('online', function(e) {
  if (useLocalStorage) {
    localStorage.removeItem('news')

  } else {
    const dbName = "Storage";
    var open = indexedDB.open(dbName);
      var db = open.result;
      var tx = db.transaction("News", "readwrite");
      var store = tx.objectStore("News");
      db.deleteObjectStore("News")
  }
});

newsButton.addEventListener('click', function() {
  var articleFieldValue = articleField.value;
  var titleFieldValue = title.value;

  if (articleFieldValue.length == 0 || titleFieldValue.length == 0) {
    window.alert('Please fill the field');
  } else {
    addNews();

    function addNews() {
      class News {
        constructor(title, text, image) {
          this.title = title;
          this.text = text;
          this.image = image;
        }
      }

      var DEFAULT_PHOTO = "img/img.png";
      var news = new News(title.value, articleField.value, DEFAULT_PHOTO);
      navigator.onLine
        ? sendToServer(news)
        : addToStorage(news);
      alert('Article sent!');

    }

    function sendToServer(newsItem) {
      var data = {
            title: title.value,
            shortdescription: title.value,
            longdescription: articleField.value
        }
        articleField.value = ''
        title.value = ''
        $.ajax({
            url: 'http://localhost:8080/api/bears',
            type: "post",
            dataType: "json",
            data: data
        });

    }

    function addToStorage(newsItem) {
      news = []
      news.push(newsItem);
      if (useLocalStorage) {
        localStorage.setItem('news', JSON.stringify(news));
      } else {
        const dbName = "Storage";
        var open = indexedDB.open(dbName);
        open.onupgradeneeded = function() {
          var db = open.result;
          var store = db.createObjectStore("News", {keyPath: "title"});
        };
        open.onsuccess = function() {
          var db = open.result;
          var tx = db.transaction("News", "readwrite");
          var store = tx.objectStore("News");
          store.put(newsItem)
      }
      }
    }
  }
});
