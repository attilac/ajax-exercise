if (typeof jQuery === 'undefined') {
  throw new Error('This js-file requires jQuery');
}

(function ($){
	'use strict';
    var $window = $(window);

	/**
	 * Fetch all albums from API
	 * 
	 */
	var getAlbumsFromAPI = function(){
		fetch(getApiUrl())
			.then(function(response){
				console.log('GET Response: ' + response.statusText);
				// returns response in json format
				return response.json();
			})	
			.catch(function(error){
				console.log('Error message: ' + error.message);
			})
			.then(function(json){
				//console.log(json);
				appendAlbums(json, 'albumContainer');
				//return json;
			});
	};

	/**
	 * Fetch single album from API
	 * @param {String} id - The id of the album to fetch
	 */
	var getSingleAlbumFromAPI = function(id){
		fetch(getApiUrl() + id)
			.then(function(response){
				// returns response in json format
				console.log('GET Response: ' + response.statusText);
				return response.json();
			})	
			.catch(function(error){
				console.log('Error message: ' + error.message);
			})
			.then(function(json){
				//console.log(json);
				populateUpdateForm(json);
				//return json;
			});
	};

	/**
	 * Post album to API
	 * @param {Object} data - a JSON Object
	 */
	var postAlbumToAPI = function(data){
		//console.log(typeof(data));
		fetch(getApiUrl(),
		{
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.catch(function(error){
			console.log('Error message: ' + error.message);
		})
		.then(function(response){
			console.log('POST Response: ' + response.statusText);
			if(response.statusText === 'Created'){
				console.log('Successfully posted album to API');
				console.log(data);
				hideModal();
				refreshAlbums();
			}
			return response;
		});	
	};

	/**
	 * Update / patch album in API
	 * @param {Object} data - JSON Object with album data
	 * @param {String} id - The id of the album to update
	 */
	var patchAlbumInDatabase = function(data, id){
		//console.log(id);
		//console.log(typeof(id));
		fetch(getApiUrl() + id,
		{
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.catch(function(error){
			console.log('Error: ' + error.message);
		})
		.then(function(response){
			console.log('PATCH Response: ' + response.statusText);
			refreshAlbums();
			//return response;
		});	
	};

	/**
	 * Delete album from API
	 * @param {String} id - The id of the album to delete
	 */
	var deleteAlbumInDatabase = function(id){
		fetch(getApiUrl() + id,
		{
			method: 'DELETE'
		})
		.then(function(response){
			console.log('DELETE Response: ' + response.statusText);
			refreshAlbums();
			return response;
		});	
	};

	/**
	 * Appends fetched albums to DOM
	 * @param {Object} albums - JSON Object with album data.
	 * @param {Object} target - The target div.
	 */
	var appendAlbums = function(albums, target) {
		var targetDiv = document.getElementById(target);	
		//console.log(typeof(targetDiv));
		//console.log(typeof(albums));
		var albumList = '<div class="row">';
		albums.forEach(function(album) {
			//console.log('id: ' + album._id + ' artist: ' + album.artist + ' title: ' + album.title);
		  	albumList += 	`<div class="col-lg-3 col-md-4" data-albumid="${album._id}">
			  					<figure class="figure">
			  						<img src="${album.cover}" class="figure-img img-fluid" alt="">
			  						<figcaption class="figure-caption">
			  							<h6>${album.title}</h6>
			  							${album.artist}
			  						</figcaption>
								</figure>
								<div class=""> 
									<a href="#" class="btn btn-danger btn-sm btn-update mb-3" data-albumid="${album._id}">Uppdatera</a>
									<a href="#" class="btn btn-warning btn-sm btn-delete mb-3" data-albumid="${album._id}">Ta bort</a>
								</div>
							</div>`;
							
		});
		albumList += '</div>';
		targetDiv.innerHTML = albumList;
		addAlbumBtnHandlers();
	};

	/**
	 * Refresh DOM
	 *
	 */
	var refreshAlbums = function(){
		console.log('Refreshing the DOM');
		document.getElementById('albumContainer').innerHTML = '';
		getAlbumsFromAPI();
	};

	/**
	 * Get input fields values
	 * @return album - a JSON Object
	 */
	var getFormInputValues = function(){
		var album = {};
		album.artist = ($('#albumArtist').val() || '' ? $('#albumArtist').val() : 'Artist Name');
		album.title = ($('#albumTitle').val() || '' ? $('#albumTitle').val() : 'Album Title');
		album.year = ($('#albumYear').val() || '' ? $('#albumYear').val() : undefined);
		album.genre = ($('#albumGenre').val() || '' ? $('#albumGenre').val() : undefined);
		album.cover = ($('#albumCover').val() || '' ? $('#albumCover').val() : undefined);
		album.description = ($('#albumDescription').val() || '' ? $('#albumDescription').val() : undefined);
		/*
		if($('#albumYear').val()){
			album.year = $('#albumYear').val();
		}
		if($('#albumGenre').val()){
			album.genre = $('#albumGenre').val();
		}
		if($('#albumCover').val()){
			album.cover = $('#albumCover').val();
		}
		if($('#albumDescription').val()){
			album.description = $('#albumDescription').val();
		}	
		*/
		//console.log(album);	
		return album;			
	};

	/**
	 * Populates input fields with values from JSON Object
	 * @param data JSON Object
	 */
	var populateUpdateForm = function(data){
		$('#albumArtist').val(data.artist);
		$('#albumTitle').val(data.title);
		$('#albumYear').val(data.year);
		$('#albumGenre').val(data.genre);
		$('#albumCover').val(data.cover);
		$('#albumDescription').val(data.description);
		$('#albumFormSubmit').val('Uppdatera Album');
		$('#albumFormSubmit').html('Uppdatera Album');
		$('.modal-title').html('Uppdatera Album');
		//console.log(data._id);
		console.log('Populates update-form inputs');
	};

	/**
	 * Init post form title and submit button
	 *
	 */
	var populatePostForm = function(){
		$('.modal-title').html('Skapa Album');
		$('#albumFormSubmit').val('Skapa Album');
		$('#albumFormSubmit').html('Skapa Album');
	};

	/**
	 * Clears form input values
	 */
	var clearFormInputs = function() {
		$('#albumFormModal').find('input, textarea').val('');
		/*
		$('#albumArtist').val('');
		$('#albumTitle').val('');
		$('#albumYear').val('');
		$('#albumGenre').val('');
		$('#albumCover').val('');
		$('#albumDescription').val('');
		*/
	};

	/**
	 * Hides modal
	 *
	 */
	var hideModal = function(){
		$('#albumFormModal').modal('hide');
	};

	/**
	 * Adds event handlers for edit and delete buttons on albums
	 */
	var addAlbumBtnHandlers = function() {
		//deleteAlbumBtns = document.getElementsByClassName('btn-delete');
		document.querySelectorAll('.btn-delete').forEach(function(button) {
			button.addEventListener('click', deleteAlbum, false);
		});
		//updateAlbumBtns = document.getElementsByClassName('btn-update');
		document.querySelectorAll('.btn-update').forEach(function(button) {
			button.addEventListener('click', launchUpdateAlbumModal, false);
		});	
	};

	/**
	 * Event handler for #getAlbums
	 *
	 */
	var getAlbums = function(event){
		event.preventDefault();
		console.log('Fetching album data..');
		getAlbumsFromAPI();
	};

	/**
	 * Event handler for .btn-delete
	 *
	 */
	var deleteAlbum = function(event){
		event.preventDefault();
		console.log('Delete album with id ' + this.dataset.albumid);
		deleteAlbumInDatabase(this.dataset.albumid);
	};

	/**
	 * Event handler for .btn-update
	 *
	 */
	var launchUpdateAlbumModal = function(event){
		event.preventDefault();
		console.log('Fetching single album data..');
		getSingleAlbumFromAPI(this.dataset.albumid);
		var submitBtn = document.getElementById('albumFormSubmit');
		submitBtn.dataset.albumid = (this.dataset.albumid);
		submitBtn.addEventListener('click', updateAlbum, false);
		$('#albumFormModal').modal();
	};

	/**
	 * Event handler for submitbutton in update-form
	 *
	 */
	var updateAlbum = function(event){
		event.preventDefault();
		//console.log(this.dataset.albumid);
		var albumData = getFormInputValues();
		console.log(albumData);
		patchAlbumInDatabase(albumData, this.dataset.albumid);
		hideModal();
	};

	/**
	 * Event handler for submitbutton in new album-form
	 * 
	 */
	var submitAlbumValues = function(event) {
		event.preventDefault();
		var postData = getFormInputValues();
		console.log('Posting album to API..');
		postAlbumToAPI(postData);
	};

	/**
	 * Event handler for #addAlbumBtn
	 *
	 */
	var launchCreateAlbumModal = function(event){
		event.preventDefault();
		populatePostForm();
		var submitBtn = document.getElementById('albumFormSubmit');
		submitBtn.addEventListener('click', submitAlbumValues, false);
		$('#albumFormModal').modal();
	};

	/**
	 * Event handler for modal on hide
	 *
	 */
	$('#albumFormModal').on('hide.bs.modal', function (e) {
		clearFormInputs();
		var submitBtn = document.getElementById('albumFormSubmit');
		submitBtn.removeEventListener('click', updateAlbum);
		submitBtn.removeEventListener('click', submitAlbumValues);
	});

	/**
	 * 
	 *
	 */
	var getApiUrl = function(){
		return 'http://fend16.azurewebsites.net/albums/';
	};

	// App

	var getAlbumsBtn = document.getElementById('getAlbums');
	getAlbumsBtn.addEventListener('click', getAlbums, false);
	var addAlbumBtn = document.getElementById('addAlbum');
	addAlbumBtn.addEventListener('click', launchCreateAlbumModal, false);

	/*
	$('#albumArtist').on('focus', function(e){
		if($('#albumArtist').val()){
			var hej = $('#albumArtist').val();
			console.log(hej);
		}
		//console.log(($('#albumArtist').val() || '') ? true : false);
	});
	*/


}(jQuery));