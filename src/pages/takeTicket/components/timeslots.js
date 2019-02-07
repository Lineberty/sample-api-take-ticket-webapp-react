import React from 'react';
import lbHttp from '../../../services/lb-http.js'

function Timeslot (props) {
  return (
    <div className="list-item" onClick={() => props.onClick() }>
      {props.timeslot}
    </div>
  );
}

export class Timeslots extends React.Component {

  constructor(props) {
    super(props);
    this.state = {timeslots: {}};
    this.lbHttpInstance = lbHttp.getInstance()
  }

  async componentDidMount() {
    let timeslots = {}
    try {
      timeslots = await this.lbHttpInstance.getQueueAvailability()
      console.log( 'timeslots received' )
      console.log( timeslots )
    } catch (err) {
      console.log( 'timeslots error' )
      console.log( err )
    }
    this.setState( {timeslots : timeslots })
  }

  getTimeslotList() {
    let res = []
    for( const k in this.state.timeslots ) {
      res.push(
        <Timeslot
          key={k}
          timeslot={this.state.timeslots[k]}
          onClick={() => this.props.confirm(this.state.timeslots[k])}
        />
      )
    }

    return res
  }

  render() {
    return (
      <div>
        <button onClick={() => this.props.back()} className="button backButton primary">Back</button>
        <h2> Select your timeslot </h2>
        <div className="list"> {this.getTimeslotList()} </div>
      </div>
    )
  }

}
