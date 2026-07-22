'use strict';

var BASE_URL = 'https://futbolle-daw-uai-2026.onrender.com/api/players';

function getRandomPlayer(onSuccess, onError){
    fetch(BASE_URL + '/random')
        .then(function (response){
            if (!response.ok){
                throw new Error('Newwork response was not ok')
            }
            return response.json();
        })
        .then(function(data){
            onSuccess(data);
        })
        .catch(function(error){
            onError(error);
        })
}

function searchPlayers(query, limit, onSuccess, onError){
    var searchLimit = limit || 8;
    var url = BASE_URL + '/search?q' + encodeURIComponent(query) + '&limit=' + searchLimit;

    if (!query || query.length < 2) {
        onSuccess([]);
        return;
    }

    fetch(url)
        .then(function(response){
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(data){
            onSuccess(data);
        })
        .catch(function(error){
            onError(error);
        });
}