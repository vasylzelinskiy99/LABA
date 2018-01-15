var condition = "online";
var useLocalStorage = false

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

window.addEventListener('online', function(e) {
  var condition = 'online'
  takeFromServer()
});

window.addEventListener('offline', function(e) {
  var condition = 'offline'
  takeFromStorage()
});
if (condition=='online') {
  takeFromServer()
}

function createNews(news) {
  console.log(news);
  var element = document.getElementById("news");
  element.innerHTML += '<div class="col-lg-4"><div class="article"> <center><img src = "img/img.png" alt = "News" width="300" height = "300"></center><center><h3>' + news.shortdescription + '</h3></center><p>' + news.longdescription + '</p></div></div>'
}

function getNews() {
  var news = [];
  var news_item = localStorage.getItem('news');
  if (news_item !== null) {
    news = JSON.parse(news_item);
  }
  return news;
}

function getNewsFromDB() {
  var dbNews = [];
  var db_news_item = ''
  const dbName = "Storage";
  var open = indexedDB.open(dbName);
  open.onsuccess = function() {
    var db = open.result;
    var tx = db.transaction("News", "readwrite");
    var objectStore = tx.objectStore("News");
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        db_news_item = cursor.value
      } else {}
      if (db_news_item !== null && db_news_item !== '') {
        dbNews.push(db_news_item)
          console.log(dbNews);
          for (var i = 0; i < dbNews.length; i++) {
            createNews(dbNews[i]);
          }
      }
    }
  }
  return true
}

  function takeFromServer() {
    $.ajax({
        url: 'http://localhost:8080/api/bears',
        type: "get",
        dataType: "json",

        success: function(data) {
            for (var i = 0; i < data.length; i++) {
              createNews(data[i]);
            }
        }
    });
  }

  function takeFromStorage() {
    if (useLocalStorage) {
      var news = getNews();
      if ((typeof news !== 'undefined') && (news.length > 0)) {
        for (var i = 0; i < news.length; i++) {
          createNews(news[i]);
        }
      }
      localStorage.removeItem('news')
    } else {
      getNewsFromDB();

      if(getNewsFromDB()){
      const dbName = "Storage";
      var open = indexedDB.open(dbName);
      open.onsuccess = function() {
        console.log('clear');
        var db = open.result;
        var tx = db.transaction("News", "readwrite");
        var objectStore = tx.objectStore("News");
        var objectStoreRequest = objectStore.clear();
      }
    }
    }
  }
