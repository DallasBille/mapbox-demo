import React, { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import "./App.css";

class App extends Component {
  state = {
    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: 42.430472,
      longitude: -123.334102,
      zoom: 16
    },
    stations: {},
    userLocation: {}
  };

  setUserLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      let setUserLocation = {
        lat: position.coords.latitude,
        long: position.coords.longitude
      };
      let newViewport = {
        height: "100vh",
        width: "100vw",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 10
      };
      this.setState({
        viewport: newViewport,
        userLocation: setUserLocation
      });
    });
  };

  // insertMarkerComp = () => {
  //   return (
  //     <Marker
  //       latitude={this.state.userLocation.latitude}
  //       longitude={this.state.userLocation.longitude}
  //     >
  //       <div>MARKER</div>
  //     </Marker>
  //   );
  // };

  render() {
    return (
      <div className="App">
        <button onClick={this.setUserLocation}>My Location</button>
        <div className="map">
          <ReactMapGL
            {...this.state.viewport}
            mapStyle="mapbox://styles/mapbox/outdoors-v11"
            onViewportChange={viewport => this.setState({ viewport })}
            mapboxApiAccessToken="pk.eyJ1IjoiZGFsbGFzYmlsbGUiLCJhIjoiY2p6OHR1aGhoMDZnZDNjbXB2ZWZlcXFudCJ9.gjjYkOkTtA-Qe1jhbvF2gQ"
          >
            {Object.keys(this.state.userLocation).length !== 0 ? (
              <Marker
                latitude={this.state.userLocation.lat}
                longitude={this.state.userLocation.long}
              >
                <img className="location-icon" src="location-icon.svg" />
              </Marker>
            ) : (
              <div></div>
            )}
          </ReactMapGL>
        </div>
      </div>
    );
  }
}

export default App;

// fetchStationAPI = () => {
//   fetch(
//     `https://data.ny.gov/resource/nyctransitsubwayentrance-and-exit.json?`
//   )
//     .then(res => res.json())
//     .then(stations => {
//       this.setState({
//         stations: stations
//       });
//     });
// };
// componentDidMount() {
//   this.fetchStationAPI();
// }
