import React, { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import "./App.css";

class App extends Component {
  state = {
    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: 40.7250863,
      longitude: -73.9773608,
      zoom: 15
    },
    wifiHotspots: [],
    userLocation: {}
  };

  componentDidMount() {
    this.fetchStationAPI();
  }

  fetchStationAPI = () => {
    fetch("https://data.cityofnewyork.us/resource/yjub-udmw.json")
      .then(res => res.json())
      .then(hotspots => {
        let freeWifi = this.freeWifiFilter(hotspots);
        this.setState({
          wifiHotspots: freeWifi
        });
      });
  };

  freeWifiFilter = allHotspots => {
    return allHotspots.filter(spot => {
      return spot.type === "Free";
    });
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

  loadWifiMarkers = () => {
    return this.state.wifiHotspots.map(spot => {
      return (
        <Marker
          key={spot.objectid}
          latitude={parseFloat(spot.latitude)}
          longitude={parseFloat(spot.longitude)}
        >
          <img src="/wifi.svg" alt="" />
        </Marker>
      );
    });
  };
  // <img className="location-icon" src="/location-icon.svg" alt="" />

  render() {
    return (
      <div className="App">
        <div>
          Icons made by{" "}
          <a
            href="https://www.flaticon.com/authors/gregor-cresnar"
            title="Gregor Cresnar"
          >
            Gregor Cresnar
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
        <div className="map">
          <ReactMapGL
            {...this.state.viewport}
            mapStyle="mapbox://styles/mapbox/outdoors-v11"
            onViewportChange={viewport => this.setState({ viewport })}
            mapboxApiAccessToken="pk.eyJ1IjoiZGFsbGFzYmlsbGUiLCJhIjoiY2p6OHR1aGhoMDZnZDNjbXB2ZWZlcXFudCJ9.gjjYkOkTtA-Qe1jhbvF2gQ"
          >
            {this.loadWifiMarkers()}
          </ReactMapGL>
        </div>
      </div>
    );
  }
}

export default App;
// <div>Icons made by <a href="https://www.flaticon.com/authors/google" title="Google">Google</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
