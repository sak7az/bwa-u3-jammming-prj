let accessToken = null;
const clientID = '6a65b426a713433b883cb55fb515f13a';
const redirectURI = 'http://localhost:3000/';
let expiresIn = null;

const Spotify = {
  getAccessToken() {
    console.log('Spotify.getAccessToken is called');
    if(accessToken){
      return accessToken;
      //console.log('accessToken is returning truthy');
    }
    else if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/))
    {
      //console.log('the second condition is happening');
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      //console.log(accessToken);
      expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      //console.log(expiresIn);

      window.setTimeout(() => accessToken = '', expiresIn*1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    }
    else
    {
      let url = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = url;
    };
  },


  search(term){
    console.log('Spotify.search is being called');
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers: {Authorization:  `Bearer ${Spotify.getAccessToken()}`}
      }
      ).then(response =>{
      if (response.ok){
        return response.json();
      } else {
        throw new Error('Search request failed');
      }
    }).then(jsonResponse =>{
      return jsonResponse.tracks.items.map((track)=>(
        {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }
      ));
    });
  },

/*  savePlaylistTest(){
    fetch('https://api.spotify.com/v1/users/1228685307/playlists', {
      headers: {
        Authorization: 'Bearer BQBb1wpgak1InJae2rUqKh-LojmGtg0r7IFXVtJCsUv76aGKbBaOOHufRWLH8i-NKThbQKL6P1nqrBpTHsoEpSSUP_5EG3InT--sN8XDSeI8P4btSOncUurY_B3SjDCFzN-kWSyxabycf8OKTFpY0-161XUncpJMHLcqiItVflRJzA',
        'Content-type':
      }
    })
  },*/

  savePlaylist(playlistName, trackURIs){
    if (playlistName && trackURIs){
      let defaultAccessToken = Spotify.getAccessToken();
      let userID;
      let playlistID;

      fetch('https://api.spotify.com/v1/me', {headers: {
        Authorization: `Bearer ${Spotify.getAccessToken()}`
      }}
    ).then(response=>{
      if (response.ok){
        return response.json();
    } else{
      throw new Error('user id retrieval request failed');
    }
  }).then(jsonResponse =>{
      console.log(jsonResponse);
      return jsonResponse.id;
    }).then(id => {
      Spotify.getPlaylistID(playlistName, id, trackURIs)
    });}
},

async addTracksToPlaylist(playlistName, userId, trackURIs, playlistId){
  console.log('!!', Spotify.getAccessToken())
  fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${Spotify.getAccessToken()}`,
      'Content-Type':'application/json',
      Accept: 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      uris: trackURIs,
    })}).then(response=>{
  console.log(response)
  if (response.ok){
    return response.json();
  } else {
    throw new Error('track adding failed');
  }
});
},

  getPlaylistID(playlistName, userId, trackURIs){
    fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${Spotify.getAccessToken()}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          name: playlistName
        })
      }).then(response=>{
        console.log(response)
        if (response.ok){
          return response.json();
        } else {
          throw new Error('playlist creation request failed');
        }}).then(jsonResponse=>{
          return jsonResponse.id;}).then(id => {
            Spotify.addTracksToPlaylist(playlistName, userId, trackURIs, id)
          });
        },
      };

export default Spotify
