import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify.js';




class App extends Component {
  constructor(props){
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

    this.state={
      SearchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    }
  };

  addTrack(track){
    if (this.state.playlistTracks.find(savedTrack=> savedTrack.id === track.id)){
      return;
    } else {
      const currentPlaylistTracks = this.state.playlistTracks;
      currentPlaylistTracks.push(track);
      this.setState({playlistTracks: currentPlaylistTracks});
      console.log(this.state.playlistTracks);
    }
  }

  removeTrack(track){
    const newPlaylist = this.state.playlistTracks.filter((trk)=> trk.id !== track.id);
    this.setState({playlistTracks: newPlaylist});
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    let inputTrackURIs = this.state.playlistTracks.map(track=>{
      return track.uri;
    });
    Spotify.savePlaylist(this.state.playlistName, inputTrackURIs);
    this.setState({});
  }

  search(searchTerm){
    if(searchTerm){
    Spotify.search(searchTerm).then(newResults=>{
      this.setState({SearchResults: newResults});
    })
  } else {
    return;
  }
    //let newSearchResults = Spotify.search(searchTerm);
    //console.log(newSearchResults);
    //this.setState({SearchResults:Spotify.search(searchTerm)})
  }

  render(){
    console.log(Spotify.getAccessToken());
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults SearchResults={this.state.SearchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
