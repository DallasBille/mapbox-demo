import React, { Component } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import "./App.css";
import ReactModal from "react-modal";
import { thisTypeAnnotation } from "@babel/types";

class App extends Component {
  state = {
    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: 40.7250863,
      longitude: -73.9773608,
      zoom: 12
    },
    wifiHotspots: [],
    userLocation: {},
    selectedHotspot: null
  };

  componentDidMount() {
    this.fetchStationAPI();
  }

  fetchStationAPI = () => {
    fetch("https://data.cityofnewyork.us/resource/yjub-udmw.json")
      .then(res => res.json())
      .then(hotspots => {
        let indoors = this.indoorWifi(hotspots);
        let freeWifi = this.filterFreeWifi(hotspots);
        let freeObj = this.sortType(hotspots);
        console.log(freeObj);
        this.setState({
          wifiHotspots: freeWifi
        });
      });
  };

  sortType = hots => {
    let obj = {};
    hots.forEach(spot => {
      if (!obj[spot.location_t]) {
        obj[spot.location_t] = 1;
      } else {
        obj[spot.location_t] += 1;
      }
    });
    return obj;
  };

  indoorWifi = hotspots => {
    return hotspots.filter(spot => {
      return (
        spot.location_t !== "Outdoor Kiosk" && spot.location_t !== "Outdoor"
      );
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
        zoom: 13
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
          <img
            onClick={() => {
              this.setSelectedHotspot(spot);
            }}
            src="/wifiturqiose.svg"
            alt=""
          />
        </Marker>
      );
    });
  };

  filterFreeWifi = hotspots => {
    return hotspots.filter(spot => {
      return spot.type === "Free";
    });
  };

  setSelectedHotspot = object => {
    this.setState({
      selectedHotspot: object
    });
  };

  closePopup = () => {
    this.setState({
      selectedHotspot: null
    });
  };

  render() {
    return (
      <div className="App">
        <button onClick={this.setUserLocation}>My Location</button>
        <div className="information-modal">
          <p>This will hold the information about the type of hotspot it is.</p>
        </div>
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
                <img className="location-icon" src="/location-icon.svg" />
              </Marker>
            ) : null}
            {this.loadWifiMarkers()}
            {this.state.selectedHotspot !== null ? (
              <Popup
                latitude={parseFloat(this.state.selectedHotspot.latitude)}
                longitude={parseFloat(this.state.selectedHotspot.longitude)}
                onClose={this.closePopup}
              >
                <div>
                  <p>
                    <b>Location:</b> {this.state.selectedHotspot.location}
                    {", "}
                    {this.state.selectedHotspot.city}
                  </p>
                  <p>
                    <b>Type:</b> {this.state.selectedHotspot.location_t}
                  </p>
                </div>
              </Popup>
            ) : null}
          </ReactMapGL>
          <div>
            Icons made by{" "}
            <a
              href="https://www.flaticon.com/authors/smashicons"
              title="Smashicons"
            >
              Smashicons
            </a>{" "}
            from{" "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
// <div>Icons made by <a href="https://www.flaticon.com/authors/google" title="Google">Google</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
