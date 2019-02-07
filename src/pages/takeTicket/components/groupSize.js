import React from 'react';
export class GroupSize extends React.Component {

  constructor(props) {
    super(props);
    this.state = {groupSize: 1};
  }

  remove () {
    this.setState( { groupSize: this.state.groupSize - 1} )
  }

  add () {
    this.setState( { groupSize: this.state.groupSize + 1} )
  }

  render() {
    return (
      <div>
        <button onClick={() => this.props.back()} className="button backButton primary">Back</button>
        <h2> Select the number of people in your group </h2>
        <div className="button-group-size" onClick={() => this.remove() }> - </div>
        {this.state.groupSize}
        <div className="button-group-size" onClick={() => this.add() }> + </div>
        <button className="button" onClick={() => this.props.confirm( this.state.groupSize )} > Confirm number </button>
      </div>
    )
  }
}
