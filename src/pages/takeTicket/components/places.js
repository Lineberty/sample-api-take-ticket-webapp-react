import React from 'react';
import * as config from '../../../services/config.js'
import lbHttp from '../../../services/lb-http.js'

export function Place (props) {
  return (
    <div className="list-item" onClick={() => props.onClick() }>
      {props.place.name[ config.defaultLang ]}
    </div>
  );
}

export default class Places extends React.Component {

  constructor(props) {
    super(props);
    this.state = {places: {}};
    this.lbHttpInstance = lbHttp.getInstance()
  }

  async componentDidMount() {
    let places = {}
    try {
      places = await this.lbHttpInstance.getPlaces()
      console.log( 'Places received' )
      console.log( places )
    } catch (err) {
      console.log( 'Paces error' )
      console.log( err )
    }

    this.setState( {places : places })
  }

  getPlaceList() {
    let res = []
    for( const k in this.state.places ) {
      res.push(
        <Place
          key={ this.state.places[k].placeId }
          place={ this.state.places[k] }
          onClick={() => this.props.confirm( this.state.places[k] )}
        />
      )
    }

    return res
  }

  render() {
    return (
      <div>
        <button onClick={() => this.props.back()} className="button backButton primary">Home</button>
        <h2> Select your place </h2>
        <div className="list"> {this.getPlaceList()} </div>
      </div>
    )
  }

}
