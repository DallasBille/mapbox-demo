import React from "react";
import ReactModal from "react-modal";

export default class ModalComponent extends React.Component {
  OPTIONS = ["Indoor", "Library", "Outdoor", "Outdoor Kiosk", "Subway Station"];
  // This Reduce function in state create an object from our OPTIONS array,
  //  it create a key for each element who's value is false.
  state = {
    checkboxes: this.OPTIONS.reduce(
      (options, option) => ({
        ...options,
        [option]: false
      }),
      {}
    ),
    allHotspots: null
  };

  //   this function takes in our onChange event, takes the previous state and updates
  // the changeEvent.name to its opposite boolean value.
  handleCheckboxChange = changeEvent => {
    const { name } = changeEvent.target;

    this.setState(prevState => ({
      checkboxes: {
        ...prevState.checkboxes,
        [name]: !prevState.checkboxes[name]
      }
    }));
  };
  // programaticall create a checkbox from OPTIONS variable.
  createCheckBox = () => {
    return this.OPTIONS.map(option => {
      let checkedStatus = this.state.checkboxes[option];
      return (
        <p key={option}>
          <input
            checked={checkedStatus}
            onChange={this.handleCheckboxChange}
            type="checkbox"
            name={option}
            value={option}
          />
          {option}
        </p>
      );
    });
  };
  // runs when All Hotspots button is pushed.
  handleAllHotspotsAndCloseModal = () => {
    this.props.handleModalToggle();
    this.props.handleAllHotspots();
  };

  render() {
    return (
      <div className="information-icon-div">
        <img
          className="information-icon"
          onClick={this.props.handleModalToggle}
          src="/info.svg"
          alt="pereferences"
        />
        <ReactModal ariaHideApp={false} isOpen={this.props.modalToggleState}>
          <p>
            <button
              onClick={this.props.handleModalToggle}
              className="modal-close"
            >
              X
            </button>
          </p>
          <h3>Which Hotspots Would You Like to See?</h3>
          <button onClick={this.handleAllHotspotsAndCloseModal}>
            All Hotspots
          </button>
          <form action="/action_page.php" onChange={this.handleChange}>
            {this.createCheckBox()}
          </form>
          <button
            onClick={() => {
              this.props.handleModalObjectSubmit(this.state.checkboxes);
            }}
          >
            Submit
          </button>
        </ReactModal>
      </div>
    );
  }
}
