function isOnline() {
	return window.navigator.onLine;
}

class News{
	constructor(header, shortText, fullText, image){
		this.header = header;
		this.shortText = shortText;
		this.fullText = fullText;
		this.image = image;
	}
}

function getNews() {
    var news = new Array;
    var news_item = localStorage.getItem('news');
    if (news_item !== null) {
        news = JSON.parse(news_item);
    }
    return news;
}

function addNews(){
	var DEFAULT_PHOTO = "./photo_ico.png";
	var imageForm = document.getElementById("userInputFile");
	var newsHeader = document.getElementById("header");
	var newsShortText = document.getElementById("shortText");
	var newsText = document.getElementById("newsText");
	var imagePreview = document.getElementById('user-image');
	if(newsHeader.value == ""){
		alert("Вкажіть заголовок статті");
		return;
	}
	if(newsShortText.value == ""){
		alert("Вкажіть короткий опис статті");
		return;
	}
	if(newsText.value == ""){
		alert("Вкажіть текст статті");
		return;
	}
	if(imagePreview.src == DEFAULT_PHOTO){
		alert("Завантажте фото для статті");
		return;
	}
	var news = new News(newsHeader.value, newsShortText.value, newsText.value, imagePreview.src);
	if(isOnline()){
		//server stuff
	}
	addToStorage(news);
	alert('Готово!');
	newsHeader.value = "";
	newsShortText.value = "";
	newsText.value = "";
	imagePreview.src = DEFAULT_PHOTO;
	imageForm.value="";
}

function addToStorage(newsItem){
	var news = getNews();
    news.push(newsItem);
    localStorage.setItem('news', JSON.stringify(news));
    return false;
}

function loadPreviewPhoto(){
	var src = document.getElementById("userInputFile");
	var target = document.getElementById("user-image");
	var fr = new FileReader();
	fr.readAsDataURL(src.files[0]);
	fr.onload = function(e){
		target.src = this.result;
	};
}

function createNews(news){
	var element = document.getElementById("newsRow");
	element.innerHTML += '<div class="col-lg-4"> <center><img src = "' + news.image + '" alt = "News" width="300" height = "300"></center><center><h3>'
	+ news.header + '</h3></center><p>' + news.shortText + '</p></div>'
}

function show(){
	if(isOnline()){
		//server stuff
	}
	var news = getNews();
    if ((typeof news !== 'undefined') && (news.length > 0)) {
	    for(var i = 0; i < news.length; i++) {
    		createNews(news[i]);
	    }
	}
}
