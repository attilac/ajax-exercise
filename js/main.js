//use('esversion: 6');

/*
 *
 *
 */
var getAlbumsFromAPI = function() {
	var ajaxRequest;

	if (window.XMLHttpRequest) {
		ajaxRequest = new XMLHttpRequest();
	} else {
		// code for older browsers
		ajaxRequest = new ActiveXObject('Microsoft.XMLHTTP');
	}
	ajaxRequest.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var albums = JSON.parse(this.responseText);
			console.log(albums);
			console.log(typeof(albums));
			//appendAlbums(albums, 'albumContainer');
		}
	};
	ajaxRequest.open('GET', 'http://fend16.azurewebsites.net/albums', true);
	ajaxRequest.send();
};

/**
 * Posts an album to the Web API using 'POST'
 * @return {void}
 */
var postAlbumToAPI = function(){

	//Same as get, we need a ajax object to handle the request
	var ajaxRequest = new XMLHttpRequest();

	//The status code we get back in this case is a 201: Content created.
	//But everything else is the same
	ajaxRequest.onreadystatechange = function() {
		if(ajaxRequest.status == 201 && ajaxRequest.readyState == 4) {
		    console.log("%c Successfully posted the album with title and artist 🐱", 'color: lightsalmon');
		    console.log(ajaxRequest.responseText);
		} 
	};

	//The method is now 'POST' when sending data to the server
	ajaxRequest.open("POST", 'http://fend16.azurewebsites.net/albums' , true);

	//But when sending data to the API we must provide a specifik header 🤖
	//to tell the server that it should accept the parameters in a correct format
	ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//When we send the request we supply the parameters as an argument
	//each parameter is separated with an ampersand '&'.
	ajaxRequest.send("title=xx&artist=The XX");

};

/**
 * Deletes an album from the Web API using 'DELETE'
 * @return {void} Doesn't have a return type
 */
var deleteAlbumInDatabase = function(){
	var ajaxRequest = new XMLHttpRequest();
	ajaxRequest.onreadystatechange = function() {
		if(ajaxRequest.status == 200 && ajaxRequest.readyState == 4) {
		    console.log("%c Successfully deleted the album with title and artist 🐱", 'color: lightsalmon');
		    console.log(ajaxRequest.responseText);
		} 
	};
	ajaxRequest.open('DELETE', 'http://fend16.azurewebsites.net/albums/5891dfa1f8d34821a81c1a2f' , true);
	ajaxRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	ajaxRequest.send();

};

/**
 * Patches the chosen object with new parameters
 * @return {none} Doesn't have a return type
 */
var patchAlbumInDatabase = function(){
	var ajaxRequest = new XMLHttpRequest();
	ajaxRequest.onreadystatechange = function() {
		if(ajaxRequest.status == 200 && ajaxRequest.readyState == 4) {
		    console.log("%c Successfully patched the album with title and artist 🐱", 'color: lightsalmon');
		    console.log(ajaxRequest.responseText);
		} 
	};
	ajaxRequest.open('PATCH', 'http://fend16.azurewebsites.net/albums/589454ff97597b47ec90d0bc' , true);
	ajaxRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	ajaxRequest.send('title=Windowlicker&artist=Aphex Twin&cover=&description=');
};

/*
 *
 *
 */
var appendAlbums = function(albums, target) {
	var targetDiv = document.getElementById(target);	
	//console.log(typeof(targetDiv));
	var albumList = '<div class="row">';
	albums.forEach(function(object) {
		console.log('id: ' + object._id + ' artist: ' + object.artist + ' title: ' + object.title);
	  	albumList += 	`<div class="col-lg-3 col-md-4" data-id="${object._id}">
		  					<figure class="figure">
		  						<img src="${object.cover}" class="figure-img img-fluid" alt="">
		  						<figcaption class="figure-caption">
		  							<h6>${object.title}</h6>
		  							${object.artist}
		  						</figcaption>
							</figure>
							<a class="btn btn-danger" href="#">delete</a>
						</div>`;
	});
	albumList += '</div>';
	targetDiv.innerHTML = albumList;
};

/**
 * 
 *
 */
var postAlbum = function(){
	postAlbumToAPI();
};

/**
 * Gets JSON from the local recipes.json file in the folder
 * @return {void} Doesn't have a return type
 */
var getDaRecipes = function(){
  var ajaxRequest = new XMLHttpRequest();
  ajaxRequest.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      console.log(ajaxRequest.responseText);
    }
  };

  //We can also get a lokal JSON-file and load it. We use the same
  //methods but instead of specifying a URL we just supply the file.
  //It is interpreted the same way
  ajaxRequest.open('GET', 'recipes.json', true);
  ajaxRequest.send();
};

/**
 *  INFO ABOUT READYSTATECHANGE
 * 
 * By defining onreadystatechange before the open method is invoked, 
 * it is able to detect every state change from 0 through 4. 
 * If it is defined after the open method, then only states 1 through 4 
 * will be detected. For this reason, it is generally preferred to 
 * place the onreadystatechange assignment before open().
 * 
 * http://stackoverflow.com/a/17006468
 */


getAlbumsBtn = document.getElementById('getAlbums');
getAlbumsBtn.addEventListener('click', getAlbumsFromAPI, false);

postAlbumBtn = document.getElementById('postAlbum');
postAlbumBtn.addEventListener('click', postAlbum, false);

patchAlbumBtn = document.getElementById('patchAlbum');
patchAlbumBtn.addEventListener('click', patchAlbumInDatabase, false);

deleteAlbumBtn = document.getElementById('deleteAlbum');
deleteAlbumBtn.addEventListener('click', deleteAlbumInDatabase, false);

//getAlbumsFromAPI();