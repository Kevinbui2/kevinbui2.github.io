var client_id = '2324d4a0a83a4e26b618f73ba2d5cd0b';
var redirect_uri = 'https://kevinbui2.github.io/spotify';
var scope = 'user-library-read user-top-read';

var url = 'https://accounts.spotify.com/authorize';
url += '?response_type=token';
url += '&client_id=' + encodeURIComponent(client_id);
url += '&scope=' + encodeURIComponent(scope);
url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

window.location.replace(url)