import React from 'react';
import {AppointmentTypes} from './components/appointmentTypes.js';
import {GroupSize} from './components/groupSize.js';
import Places from './components/places.js';
import {Queues} from './components/queues.js';
import {Timeslots} from './components/timeslots.js';
import LocalStorage from '../../services/local-storage'
import lbHttp from '../../services/lb-http.js'

export class TakeTicket extends React.Component {

  localStorage

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      lastPage: -1,
    };

    this.localStorage = LocalStorage.getInstance()
    this.lbHttpInstance = lbHttp.getInstance()
  }

  selectPlace( selectedPlace ) {
    this.localStorage.setSelectedPlace( selectedPlace )
    this.setState( { lastPage: 0, currentPage: 1 } )
  }

  selectQueue( selectedQueue ) {
    this.localStorage.setSelectedQueue( selectedQueue )
    this.setState( { lastPage: 1 } )

    if ( Object.keys(selectedQueue.appointmentTypes).length > 1 ) {
      this.setState( { currentPage: 2 } )
    } else {
      const tmpIndex = Object.keys(selectedQueue.appointmentTypes)[0]
      this.selectAppointmentType( selectedQueue.appointmentTypes[ tmpIndex ] )
    }

  }

  selectAppointmentType( selectedAppointmentType ) {
    this.localStorage.setSelectedAppointmentType( selectedAppointmentType )
    this.setState( { lastPage: 2 } )

    if (
      this.state.selectedQueue
      && this.state.selectedQueue.config
      && this.state.selectedQueue.config.groupSizeLimit
      && this.state.selectedQueue.config.groupSizeLimit.min
      && this.state.selectedQueue.config.groupSizeLimit.max
    ) {

      if ( this.state.selectedQueue.config.groupSizeLimit.min !== this.state.selectedQueue.config.groupSizeLimit.max ) {
        this.setState( { currentPage: 3 } )
      } else {
        this.selectGroupSize( this.state.selectedQueue.config.groupSizeLimit.min )
      }

    } else {
      this.selectGroupSize( 1 )
    }
  }

  selectGroupSize( selectedGroupSize ) {
    this.localStorage.setSelectedGroupSize( selectedGroupSize )
    this.setState( { lastPage: 3, currentPage: 4 } )
  }

  async selectTimeslot( selectedBookedFor ) {
    this.localStorage.setSelectedBookedFor( selectedBookedFor )

    try {
      const ticket = await this.lbHttpInstance.bookingTicket()
      console.log( 'Ticket booked' )
      console.log( ticket )
      this.setState( { lastPage: -1, currentPage: 0 } )
      this.props.goToTicket()
    } catch (err) {
      console.log( 'Ticket booking error' )
      console.log( err )
      alert( err.error )
    }
  }

  back() {

    switch (this.state.lastPage) {
      case -1:
        this.setState( { lastPage: -1, currentPage: 0 } )
        return this.props.back()

      case 0:
        return this.setState( { lastPage: -1, currentPage: 0, selectedPlace: null, selectedQueue: null, selectedAppointmentType: null, selectedGroupSize: null, selectedBookedFor: null } )

      case 1:
        return this.setState( { lastPage: 0, currentPage: 1, selectedQueue: null, selectedAppointmentType: null, selectedGroupSize: null, selectedBookedFor: null } )

      case 2:
        return this.setState( { lastPage: 1, currentPage: 1, selectedQueue: null, selectedAppointmentType: null, selectedGroupSize: null, selectedBookedFor: null } )

      case 3:
        return this.setState( { lastPage: 1, currentPage: 1, selectedQueue: null, selectedAppointmentType: null, selectedGroupSize: null, selectedBookedFor: null } )

      default:
        this.setState( { lastPage: -1, currentPage: 0, selectedPlace: null, selectedQueue: null, selectedAppointmentType: null, selectedGroupSize: null, selectedBookedFor: null } )
        return this.props.back()
    }
  }

  render() {

    switch (this.state.currentPage) {
      case 0:
        return (
          <div>
            <Places back={()=> this.back()} confirm={(selectedPlace) => this.selectPlace(selectedPlace)} />
          </div>
        )
      case 1:
        return (
          <div>
            <Queues back={()=> this.back()} confirm={(selectedQueue) => this.selectQueue(selectedQueue)} />
          </div>
        )
      case 2:
        return (
          <div>
            <AppointmentTypes back={()=> this.back()} appointmentTypes={this.localStorage.getSelectedQueue().appointmentTypes} confirm={(selectedAppointmentType) => this.selectAppointmentType(selectedAppointmentType) } />
          </div>
        )
      case 3:
        return (
          <div>
            <GroupSize back={()=> this.back()} confirm={(selectedGroupSize) => this.selectGroupSize(selectedGroupSize)} />
          </div>
        )
      case 4:
        return (
          <div>
            <Timeslots back={()=> this.back()} confirm={(selectedBookedFor) => this.selectTimeslot(selectedBookedFor)} />
          </div>
        )
      default:
        return (
          <div>
            <Places back={()=> this.back()} confirm={(selectedPlace) => this.selectPlace(selectedPlace)} />
          </div>
        )
    }
  }

}
