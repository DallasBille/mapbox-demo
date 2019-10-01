import React, { Component } from "react";
import ReactMapGL, { Marker, Popup, GeolocateControl } from "react-map-gl";
import "./App.css";
import ModalComponent from "./components/ModalComponent";

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
    selectedHotspot: null,
    showModal: false,
    filterHotspots: [],
    showAllHotspots: true
  };

  componentDidMount() {
    this.fetchStationAPI();
    this.setLocationState();
  }

  fetchStationAPI = () => {
    fetch("https://data.cityofnewyork.us/resource/yjub-udmw.json")
      .then(res => res.json())
      .then(hotspots => {
        let freeWifi = this.filterFreeWifi(hotspots);
        this.setState({
          wifiHotspots: freeWifi
        });
      });
  };
  // This is a function that servers no purpose to the programs, I used it to see how many
  //  hotspots of each type there are.
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
  setLocationState = () => {
    navigator.geolocation.getCurrentPosition(position => {
      let setUserLocation = {
        lat: position.coords.latitude,
        long: position.coords.longitude
      };
      this.setState({
        userLocation: setUserLocation
      });
    });
  };
  setUserLocation = () => {
    let newViewport = {
      height: "100vh",
      width: "100vw",
      latitude: this.state.userLocation.lat,
      longitude: this.state.userLocation.long,
      zoom: 13
    };
    this.setState({
      viewport: newViewport
    });
  };
  // This function conditionally renders either the filteredWifi (which a user selects with the
  //  checkboxes in the modal, or all of the hotSpots)
  loadWifiMarkers = () => {
    if (this.state.showAllHotspots === true) {
      return this.state.wifiHotspots.map(spot => {
        return (
          <Marker
            key={spot.objectid}
            latitude={parseFloat(spot.latitude)}
            longitude={parseFloat(spot.longitude)}
          >
            <img
              className="hotspot-icon"
              onClick={() => {
                this.setSelectedHotspot(spot);
              }}
              src="/wifiturqiose.svg"
              alt=""
            />
          </Marker>
        );
      });
    } else {
      return this.state.filterHotspots.map(spot => {
        return (
          <Marker
            key={spot.objectid}
            latitude={parseFloat(spot.latitude)}
            longitude={parseFloat(spot.longitude)}
          >
            <img
              className="hotspot-icon"
              onClick={() => {
                this.setSelectedHotspot(spot);
              }}
              src="/wifiturqiose.svg"
              alt=""
            />
          </Marker>
        );
      });
    }
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
  // closes our popup for each hopspot
  closePopup = () => {
    this.setState({
      selectedHotspot: null
    });
  };

  //  toggles our show modal
  handleModalToggle = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };
  // function filters all hotspots with ones user selects in the checkbox in modal.
  filterSelectedHotspots = selectionsObject => {
    let selectedHotspots = [];

    for (let key in selectionsObject) {
      if (selectionsObject[key] === true) {
        let filtered = this.state.wifiHotspots.filter(spot => {
          return spot.location_t === key;
        });
        selectedHotspots = selectedHotspots.concat(filtered);
      }
    }
    return selectedHotspots;
  };

  // conditionally renders selected hotspots, if a user unclicks all checkboxes,
  //  then render all hotspots.
  setModalFilterState = checkbox => {
    let filteredHotspots = this.filterSelectedHotspots(checkbox);
    if (filteredHotspots.length > 0) {
      this.setState({
        filterHotspots: filteredHotspots,
        showAllHotspots: false
      });
    } else {
      this.setState({
        filterHotspots: [],
        showAllHotspots: true
      });
    }
    this.handleModalToggle();
  };

  handleAllHotspots = () => {
    this.setState({
      showAllHotspots: true
    });
  };

  render() {
    return (
      <div className="App">
        <div>
          <ReactMapGL
            className="map"
            {...this.state.viewport}
            mapStyle="mapbox://styles/mapbox/outdoors-v11"
            onViewportChange={viewport => this.setState({ viewport })}
            mapboxApiAccessToken="pk.eyJ1IjoiZGFsbGFzYmlsbGUiLCJhIjoiY2p6OHR1aGhoMDZnZDNjbXB2ZWZlcXFudCJ9.gjjYkOkTtA-Qe1jhbvF2gQ"
          >
            <GeolocateControl
              positionOptions={{ enableHighAccuracy: false }}
              trackUserLocation={true}
            />
            <ModalComponent
              handleAllHotspots={this.handleAllHotspots}
              handleModalObjectSubmit={this.setModalFilterState}
              modalToggleState={this.state.showModal}
              handleModalToggle={this.handleModalToggle}
            />
            {this.loadWifiMarkers()}
            {this.state.selectedHotspot !== null ? (
              <Popup
                latitude={parseFloat(this.state.selectedHotspot.latitude)}
                longitude={parseFloat(this.state.selectedHotspot.longitude)}
                onClose={this.closePopup}
                onRequestClose={this.closePopup}
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
    );
  }
}

export default App;
