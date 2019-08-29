import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl'
import logo from './logo.svg';
import './App.css';

class App extends Component {
        state = {
            viewport: {
              width: "100vw",
              height: "100vh",
              latitude: 42.430472,
              longitude: -123.334102,
              zoom: 16
          },
        };

        setUserLocation = () => {
            navigator.geolocation.getCurrentPosition(position => {
                let newViewport = {
                    height: "100vh",
                    width: "100vw",
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    zoom: 10
                }
                this.setState({
                    viewport: newViewport
                })
            })
        }

render(){
  return (
    <div className="App">
      <button onClick={this.setUserLocation} >My Location</button>
      <div className="map">
        <ReactMapGL {...this.state.viewport} mapStyle="mapbox://styles/mapbox/outdoors-v11" onViewportChange={(viewport => this.setState({viewport}))} mapboxApiAccessToken="pk.eyJ1IjoiZGFsbGFzYmlsbGUiLCJhIjoiY2p6OHR1aGhoMDZnZDNjbXB2ZWZlcXFudCJ9.gjjYkOkTtA-Qe1jhbvF2gQ">
        </ReactMapGL>
        </div>
    </div>
  );
  }
}

export default App;
