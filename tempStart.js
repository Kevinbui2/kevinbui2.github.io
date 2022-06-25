current_url = window.location.href;
					access_token = current_url.split("#access_token=")[1].split("&")[0];
					//document.write(access_token);
					var spotifyApi = new SpotifyWebApi();
					spotifyApi.setAccessToken(access_token)

					// Get Short Term Tracks Genre
					  spotifyApi.getMyTopTracks(options = {limit: 50, time_range: 'short_term'})
					  .then(function(data) {
					    var topTracksShortTermGenres = data.items;

					    for (let i = 0; i < topTracksShortTermGenres.length; i++) {
					    	spotifyApi.getArtist(data.items[i].artists[0].id)
							  .then(function(data2) {
							    for (let j = 0; j < data2.genres.length; j++) {
							    	genresShortTerm.push(data2.genres[j])
							    }
							  }, function(err) {
							    console.error(err);
							  });
					    }
					  }, function(err) {
					    console.log('Something went wrong!', err);
					  });

					  // Get Medium Term Tracks Genre
					  spotifyApi.getMyTopTracks(options = {limit: 50, time_range: 'medium_term'})
					  .then(function(data) {
					    var topTracksMediumTermGenres = data.items;
					    
					    for (let i = 0; i < topTracksMediumTermGenres.length; i++) {
					    	spotifyApi.getArtist(data.items[i].artists[0].id)
							  .then(function(data2) {
							    for (let j = 0; j < data2.genres.length; j++) {
							    	genresMediumTerm.push(data2.genres[j])
							    }
							  }, function(err) {
							    console.error(err);
							  });
					    }
					  }, function(err) {
					    console.log('Something went wrong!', err);
					  });

					  // Get Long Term Tracks Genre
					  spotifyApi.getMyTopTracks(options = {limit: 50, time_range: 'long_term'})
					  .then(function(data) {
					    var topTracksLongTermGenres = data.items;
					    
					    for (let i = 0; i < topTracksLongTermGenres.length; i++) {
					    	spotifyApi.getArtist(data.items[i].artists[0].id)
							  .then(function(data2) {
							    for (let j = 0; j < data2.genres.length; j++) {
							    	genresLongTerm.push(data2.genres[j])
							    }
							  }, function(err) {
							    console.error(err);
							  });
					    }
					  }, function(err) {
					    console.log('Something went wrong!', err);
					  });
						//document.getElementById('testGraphButton').disabled = false;