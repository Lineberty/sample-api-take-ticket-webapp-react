import React, { Component } from 'react';
import {TakeTicket} from './pages/takeTicket/takeTicket.js'
import {TicketHistory} from './pages/ticketHistory/ticketHistory.js'
import './App.css';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
    };
  }

  changePage( pageNum ) {
    this.setState( { currentPage: pageNum } )
  }

  back() {
    this.setState( {currentPage: 0} )
  }

  goToTicket() {
    this.setState( {currentPage: 2} )
  }

  render() {

    switch (this.state.currentPage) {
      case 0:
        return (
          <div className="lb-webappSdkTest">
            <h2> Web app test : React </h2>
            <h2> Select an action </h2>
            <br /><br />
            <button onClick={() => this.changePage(1)} className="button primary">Take a ticket</button>
            <br /><br />
            <br /><br />
            <button onClick={() => this.changePage(2)} className="button primary">Show my tickets</button>
          </div>
        )
      case 1:
        return (
          <div className="lb-webappSdkTest">
            <TakeTicket goToTicket={() => this.goToTicket()} back={() => this.back()} />
          </div>
        )
      case 2:
        return (
          <div className="lb-webappSdkTest">
            <TicketHistory back={() => this.back()} />
          </div>
        )
      default:
        return (
          <div className="lb-webappSdkTest">
            <h2> Web app test : React </h2>
            <h2> Select an action </h2>
            <br /><br />
            <button onClick={() => this.changePage(1)} className="button primary">Take a ticket</button>
            <br /><br />
            <br /><br />
            <button onClick={() => this.changePage(2)} className="button primary">Show my tickets</button>
          </div>
        )
    }
  }
}
