import * as ConfigService from './config.js';
import axios from 'axios'
import LocalStorage from './local-storage'

export default class lbHttp {

  localStorage = null
  static myInstance = null;

  static getInstance() {
    if (lbHttp.myInstance == null) {
      lbHttp.myInstance = new lbHttp();

    }

    return this.myInstance;
  }

  constructor() {
    this.localStorage = LocalStorage.getInstance()
  }

  runRequest = async (url, method = 'GET', queryParams = {}, body = {}, headers = {}) => {

    headers[ 'Access-Control-Allow-Origin' ] = '*'
    headers[ 'Access-Control-Allow-Methods' ] = 'GET, POST, PUT, OPTIONS'
    headers[ 'Access-Control-Allow-Headers' ] = 'X-Requested-With'

    const axiosConfig = {
      timeout: 10000,
      headers: headers,
      params: queryParams
    }

    try {
      let res
      switch (method) {
        case 'GET':
          res = await axios.get(url, axiosConfig)
          break
        case 'POST':
          axiosConfig.data =  body
          res = await axios.post(url, body, axiosConfig)
          break
        case 'PUT':
          axiosConfig.data =  body
          res = await axios.put(url, body, axiosConfig)
          break
        default:
          throw new Error('Bad request method')
      }

      return res.data
    } catch (err) {
      console.log(err)
      throw err
    }
  }


// ----------------------- CONNEXION -----------------------

  getApiKey = async  () => {
    const url = ConfigService.getApiKey

    try {
      return await this.runRequest( url, 'GET' )
    } catch (error) {
      console.log( 'Error while getting API_KEY' )
      console.log(error)
      throw error
    }
  }

  generateHeaderForLineberty = async ( needLinebertyAccount ) => {

    if ( !this.localStorage.issetApiKey() ) {

      try {
        const res = await this.getApiKey()
        this.localStorage.setApiKey( res.apiKey )

      } catch (err) {
        this.localStorage.setApiKey( '' )
      }

    }

    const headers = {
      'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,DELETE',
      'Access-Control-Allow-Origin': '*',
      'Content-Type':  'application/json',
    }

    const params = {
      'key': this.localStorage.getApiKey()
    }

    if ( needLinebertyAccount ) {

      try {
        await this.createOrLogUserIfNeeded()
      } catch (err) {
        console.log('Error while login the user')
        console.log( err )
      }

      headers['Authorization'] = 'Bearer ' + this.localStorage.getUserBearer()
    }

    return { headers: headers, params: params  }
  }

  createUser = async () => {
    const url = ConfigService.createUser

    try {
      return await this.runRequest( url, 'POST' )
    } catch (error) {
      console.log( 'Error while creating user' )
      console.log(error)
      throw error
    }
  }

  logUser = async () => {
    const url = ConfigService.logUser
    const params = {userId: this.localStorage.getUserId()}

    try {
      return await this.runRequest( url, 'GET', params )
    } catch (error) {
      console.log( 'Error while logging user' )
      console.log(error)
      throw error
    }
  }

  refreshToken = async () => {
    const url = ConfigService.refreshToken
    const params = {userId: this.localStorage.getUserId(), sessionId: this.localStorage.getSessionId()}

    try {
      return await this.runRequest( url, 'GET', params )
    } catch (error) {
      console.log( 'Error while refreshing token' )
      console.log(error)
      throw error
    }
  }

  createOrLogUserIfNeeded = async () => {

    if ( this.localStorage.issetUserBearer() ) {

      if ( this.localStorage.tokenIsValid() ) {

        if ( this.localStorage.needToRefreshToken() ) {

          try {
            const res = await this.refreshToken()
            this.localStorage.setUserBearer( res.jwtToken )
          } catch ( err ) {
            this.localStorage.setUserBearer( null )
          }

        }

      } else {

        try {
          const res = await this.logUser()
          this.localStorage.setUserBearer( res.jwtToken )
        } catch ( err ) {
          this.localStorage.setUserBearer( null )
        }

      }

    } else {

      try {
        const res = await this.createUser()
        this.localStorage.setUserBearer( res.jwtToken )
      } catch ( err ) {
        this.localStorage.setUserBearer( null )
      }

    }
  }






// ----------------------- DATA -----------------------


  getPlaces = async () => {
    const url = ConfigService.getPlaces
    const httpOptions = await this.generateHeaderForLineberty(false)

    try {
      return await this.runRequest(url, 'GET', httpOptions.params, null, httpOptions.headers )
    } catch (error) {
      console.log('Error while getting places')
      console.log(error)
      throw error
    }
  }

  getTickets = async () => {
    const url = ConfigService.getTickets
    const httpOptions = await this.generateHeaderForLineberty( true )

    try {
      const res = await this.runRequest( url, 'GET', httpOptions.params, null, httpOptions.headers )
      return res.tickets
    } catch (error) {
      console.log( 'Error while getting user tickets' )
      console.log(error)
      throw error
    }
  }

  getQueuesOfPlace = async () => {
    let url = ConfigService.getQueuesOfPlace
    url = url.replace( '{placeId}', this.localStorage.getSelectedPlace().placeId )
    const httpOptions = await this.generateHeaderForLineberty( false )

    try {
      return await this.runRequest( url, 'GET',httpOptions.params, null, httpOptions.headers )
    } catch (error) {
      console.log( 'Error while getting queues of place' )
      console.log(error)
      throw error
    }
  }

  getQueueAvailability = async () => {
    let url = ConfigService.getQueueAvailability
    url = url.replace( '{queueId}', this.localStorage.getSelectedQueue().queueId )
    url = url.replace( '{appointmentTypeId}', this.localStorage.getSelectedAppointmentType().appointmentTypeId )
    url = url.replace( '{select-groupSize}', this.localStorage.getSelectedGroupSize() + '' )
    const httpOptions = await this.generateHeaderForLineberty( false )

    try {
      return await this.runRequest( url, 'GET', httpOptions.params, null, httpOptions.headers )
    } catch (error) {
      console.log( 'Error while getting queue availability' )
      console.log(error)
      throw error
    }
  }

  bookingTicket = async () => {
    let url = ConfigService.bookingTicket
    url = url.replace( '{queueId}', this.localStorage.getSelectedQueue().queueId )
    const body = {
      appointmentTypeId: this.localStorage.getSelectedAppointmentType().appointmentTypeId,
      groupSize: this.localStorage.getSelectedGroupSize(),
      bookedFor: this.localStorage.getSelectedBookedFor(),
      lang: 'en_US',
      userData: {
        name: '',
        phone: ''
      },
      position: {},
      source: ConfigService.sourceBookingTicket
    }

    const httpOptions = await this.generateHeaderForLineberty( true )
    try {
      return await this.runRequest( url, 'POST', httpOptions.params, body, httpOptions.headers )
    } catch (error) {
      console.log( 'Error while booking ticket' )
      console.log(error)
      throw error
    }
  }

  cancelTicket = async ( ticketId ) => {
    let url = ConfigService.cancelTicket
    url = url.replace( '{ticketId}', ticketId )
    const httpOptions = await this.generateHeaderForLineberty( true )

    try {
      return await this.runRequest( url, 'PUT', httpOptions.params, null, httpOptions.headers )
    } catch (error) {
      console.log( 'Error while cancelling ticket' )
      console.log(error)
      throw error
    }
  }

  getQueues = async () => {
    const url = ConfigService.getQueues
    const httpOptions = await this.generateHeaderForLineberty( false )

    try {
      return await this.runRequest( url, 'GET', httpOptions.params, null, httpOptions.headers )
    } catch (error) {
      console.log( 'Error while getting queues' )
      console.log(error)
      throw error
    }
  }

  /*

  export const getQueuesState = async ( queuesId ) => {
    const url = ConfigService.getQueuesState
    const body = {queuesId: queuesId}
    const httpOptions = await this.generateHeaderForLineberty( false )

    try {
      return await this.runRequest( url, 'POST', httpOptions.params, body, httpOptions.headers )
    } catch (error) {
      console.log( 'Error while getting queuesState' )
      console.log(error)
      throw error
    }
  }

  export const getQueuesEligibility = async ( queuesId ) => {
    const url = ConfigService.getQueuesEligibility
    const body = {queuesId: queuesId}
    if ( this.localStorage.issetUserId() ) {
      body[ 'userId' ] = this.localStorage.getUserId()
    }
    const httpOptions = await this.generateHeaderForLineberty( false )

    try {
      return await this.runRequest( url, 'POST', httpOptions.params, body, httpOptions.headers )
    } catch (error) {
      console.log( 'Error while getting queuesEligibility' )
      console.log(error)
      throw error
    }
  }

  export const postponeTicket = async ( ticketId ) => {
    let url = ConfigService.postponeTicket
    url = url.replace( '{ticketId}', ticketId )
    const body = { postponeTo: this.localStorage.getSelectedBookedFor() }
    const httpOptions = await this.generateHeaderForLineberty( true )

    try {
      const ticket = await this.runRequest( url, 'PUT', httpOptions.params, body, httpOptions.headers )
      this.localStorage.setTicket( ticket )
      return ticket
    } catch (error) {
      console.log( 'Error while postponing ticket' )
      console.log(error)
      throw error
    }
  }

  export const rateTicket = async ( ticketId ) => {
    let url = ConfigService.rateTicket
    url = url.replace( '{ticketId}', ticketId )
    const body = { postponeTo: this.localStorage.getSelectedBookedFor() }
    const httpOptions = await this.generateHeaderForLineberty( true )

    try {
      const ticket = await this.runRequest( url, 'PUT', httpOptions.params, body, httpOptions.headers )
      this.localStorage.setTicket( ticket )
      return ticket
    } catch (error) {
      console.log( 'Error while rating ticket' )
      console.log(error)
      throw error
    }
  }

  */
}


