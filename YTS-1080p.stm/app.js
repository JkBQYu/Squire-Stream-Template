var express = require("express"),
	util 	= require('util'),
    http    = require("http"),
    request = require("request"),
    argv	= require('minimist')(process.argv.slice(2));

// MOVIES
if (argv.m) {	
	/*
	
	id : movie IMDB code (required)
	link : url or magnet to get movie. Support: youtube, magnet link, torrent, direct URL to video (required)
	
	quality : link quality: 1080p, 720p o 480p (optional)
	seeders : number of seeders if link is a magnet or torrent file (optional)
	size : size del link (optional)
	
    	*/
	
    var urls = [];
    var movies = [];
    var numberOfPages = 10;

    for(var j = 0; j < numberOfPages; j++) {
    	url = util.format('http://yts.re/api/list.json?sort=seeds&quality=1080p&limit=20&set=%d', j);
    	urls[j] = url;
    }
    
    urls.forEach(function(item) {
    
    	request(item, function(error, response, html) {
    	
	    	if(!error) {
	    		
	    		var ytsMovieResponse = JSON.parse(html);
	    		var ytsMovieList = ytsMovieResponse['MovieList'];
	    		var numberOfMovies = parseInt(ytsMovieList.length);
	    						
	    		for (var i = 0; i < numberOfMovies; i++) {
		    		var	movie = ytsMovieList[i];
					//var json = { id : movie['ImdbCode'], title : movie['MovieTitleClean'], quality : movie['Quality'], year : movie['MovieYear'], rating : movie['MovieRating'], genre : movie['Genre'], seeders : movie['TorrentSeeds'], size : movie['SizeByte'], link : movie['TorrentMagnetUrl']};
					var json = { id : movie['ImdbCode'], quality : movie['Quality'], seeders : movie['TorrentSeeds'], size : movie['SizeByte'], link : movie['TorrentMagnetUrl']};
					movies.push(json);
	    		}
	    		
	    		numberOfPages--;
	    		if (numberOfPages == 0) {
	    			console.log(JSON.stringify(movies));
	    		}
	    	}
    	});
    });
}
