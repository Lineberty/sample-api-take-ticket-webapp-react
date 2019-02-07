import React from 'react';
import * as config from '../../../services/config.js'
import lbHttp from '../../../services/lb-http.js'

function Queue (props) {
  return (
    <div className="list-item" onClick={() => props.onClick() }>
      {props.queue.name[ config.defaultLang ]}
    </div>
  );
}

export class Queues extends React.Component {

  constructor(props) {
    super(props);
    this.state = {queues: {}};
    this.lbHttpInstance = lbHttp.getInstance()
  }

  async componentDidMount() {
    let queues = {}
    try {
      queues = await this.lbHttpInstance.getQueuesOfPlace()
      console.log( 'Queues received' )
      console.log( queues )
    } catch (err) {
      console.log( 'Queues error' )
      console.log( err )
    }
    this.setState( {queues : queues })
  }

  getQueueList() {
    let res = []
    for( const k in this.state.queues ) {
      res.push(
        <Queue
          key={ this.state.queues[k].queueId }
          queue={this.state.queues[k]}
          onClick={() => this.props.confirm(this.state.queues[k])}
        />
      )
    }

    return res
  }

  render() {
    return (
      <div>
        <button onClick={() => this.props.back()} className="button backButton primary">Back</button>
        <h2> Select your queue </h2>
        <div className="list"> {this.getQueueList()} </div>
      </div>
    )
  }

}
