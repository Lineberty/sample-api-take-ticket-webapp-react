import React from 'react';
import lbHttp from '../../services/lb-http.js'

function getTicketState ( state ) {
  switch ( state ) {
    case 0:
      return 'BOOKED'
    case 1:
      return 'ALERTED'
    case 2:
      return 'CALLED'
    case 3:
      return 'ON HOLD'
    case 4:
      return 'NO SHOW'
    case 5:
      return 'IN PROGRESS'
    case 6:
      return 'CANCELLED'
    case 7:
      return 'DONE'
    default:
      return 'UNKNOW'
  }
}

function Ticket (props) {

  let footer
  if ( props.ticket.state < 6 ) {
    footer = (
      <div className="ticket-footer">
        <button className="button warn" onClick={() => props.onCancel()} > Cancel </button>
        <button className="button primary" onClick={() => props.onReport()} > Report </button>
        <button className="button accent" onClick={() => props.rateTicket()} > Rate </button>
      </div>
    )
  } else {
    footer = (
      <div className="ticket-footer">
        <button className="button accent" onClick={() => props.rateTicket()} > Rate </button>
      </div>
    )
  }

  return (
    <div className="ticket-container">

      <div className="ticket-header">
        { props.ticket.queue.name }
        <br />
        { props.ticket.place.name }
      </div>

      <div className="ticket-content">
        Ticket N° { props.ticket.label }
        <br />
        Group of { props.ticket.groupSize } people
        <br />
        Estimated passage at { props.ticket.timeline.estimatedFor }
        <br />
        State { getTicketState( props.ticket.state ) }
        <br />
        For "{ props.ticket.appointmentType.name }"
      </div>

      { footer }

    </div>
  );
}

export class TicketHistory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tickets: {}};
    this.lbHttpInstance = lbHttp.getInstance()
  }

  async componentDidMount() {
    await this.getTickets()
  }

  async getTickets() {
    let tickets = {}
    try {
      tickets = await this.lbHttpInstance.getTickets()
      console.log( 'Tickets received' )
      console.log( tickets )
    } catch (err) {
      console.log( 'Tickets error' )
      console.log( err )
    }

    this.setState( {tickets : tickets })
  }

  async cancelTicket( ticket ) {

    if ( window.confirm( 'Are you sure to want to cancel this ticket ?' ) ) {

      try {
        const newTicket = await this.lbHttpInstance.cancelTicket( ticket.ticketId )
        console.log( 'Ticket cancelled' )
        console.log( newTicket )
      } catch (err) {
        console.log( 'Ticket cancelling error' )
        console.log( err )
      }

      await this.getTickets()

    }

  }

  reportTicket( ticket ) {
    alert( 'Watch the document for more informations' )
  }

  rateTicket( ticket ) {
    alert( 'Watch the document for more informations' )
  }

  getPlaceList() {
    let res = []
    for( const k in this.state.tickets ) {
      res.push(
        <Ticket
          key={ this.state.tickets[k].ticketId }
          ticket={ this.state.tickets[k] }
          onCancel={() => this.cancelTicket( this.state.tickets[k] )}
          onReport={() => this.reportTicket( this.state.tickets[k] )}
          onRate={() => this.rateTicket( this.state.tickets[k] )}
        />
      )
    }

    return res
  }

  render() {

    if ( Object.keys( this.state.tickets ).length > 0  ) {
      return (
        <div>
          <button onClick={() => this.props.back()} className="button backButton primary">Home</button>
          <h2> Your tickets </h2>
          {this.getPlaceList()}
        </div>
      )

    } else {
      return (
        <div>
          <button onClick={() => this.props.back()} className="button backButton primary">Home</button>
          <h2> Your don't have any tickets </h2>
        </div>
      )
    }


  }

}
