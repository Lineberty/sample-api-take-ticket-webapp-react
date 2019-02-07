import * as config from './config'

export default class localStorage {
  static myInstance = null;

  selectedPlace = null
  selectedQueue = null
  selectedAppointmentType = null
  selectedGroupSize = null
  selectedBookedFor = null
  tickets = null

  static getInstance() {
    if (localStorage.myInstance == null) {
      localStorage.myInstance = new localStorage();
    }

    return this.myInstance;
  }

  getSelectedPlace () {
    return this.selectedPlace
  }

  getSelectedQueue () {
    return this.selectedQueue
  }

  getSelectedAppointmentType () {
    return this.selectedAppointmentType
  }

  getSelectedGroupSize () {
    return this.selectedGroupSize
  }

  getSelectedBookedFor () {
    return this.selectedBookedFor
  }

  getTickets () {
    return this.tickets
  }

  setSelectedPlace ( selectedPlace ) {
    this.selectedPlace = selectedPlace
  }

  setSelectedQueue ( selectedQueue ) {
    this.selectedQueue = selectedQueue
  }

  setSelectedAppointmentType ( selectedAppointmentType ) {
    this.selectedAppointmentType = selectedAppointmentType
  }

  setSelectedGroupSize ( selectedGroupSize ) {
    this.selectedGroupSize = selectedGroupSize
  }

  setSelectedBookedFor ( selectedBookedFor ) {
    this.selectedBookedFor = selectedBookedFor
  }

  setTickets ( tickets ) {
    this.tickets = tickets
  }

  getApiKey() {
    return window.localStorage.getItem('apiKey') ? window.localStorage.getItem('apiKey') : null
  }

  setApiKey( apiKey ) {
    apiKey ? window.localStorage.setItem('apiKey', apiKey) : window.localStorage.removeItem('apiKey');
  }

  getUserBearer() {
    return window.localStorage.getItem('userBearer') ? window.localStorage.getItem('userBearer') : null
  }

  getUserId() {
    return window.localStorage.getItem('userId') ? window.localStorage.getItem('userId') : null
  }

  getUserBearerEnding() {
    return window.localStorage.getItem('userBearerEnding') ? parseInt(window.localStorage.getItem('userBearerEnding'), 10 ) : null
  }

  getSessionId() {
    return window.localStorage.getItem('sessionId') ? window.localStorage.getItem('sessionId') : null
  }

  setUserBearer ( userBearer ) {
    userBearer ? window.localStorage.setItem('userBearer', userBearer) : window.localStorage.removeItem('userBearer')

    if ( userBearer ) {
      const bearerData = this.decodeToken( userBearer )
      window.localStorage.setItem('sessionId', bearerData.jti);
      window.localStorage.setItem('userId', bearerData.userId);
      window.localStorage.setItem('userBearerEnding', bearerData.exp + '')

    } else {
      window.localStorage.removeItem('sessionId')
      window.localStorage.removeItem('userId')
      window.localStorage.removeItem('userBearerEnding')
    }
  }

  issetApiKey() {
    const tmpApiKey = this.getApiKey()
    return tmpApiKey && tmpApiKey !== null && tmpApiKey !== 'null' && tmpApiKey !== ''
  }

  issetUserId() {
    const tmpUserId = this.getUserId()
    return tmpUserId && tmpUserId !== null && tmpUserId !== 'null' && tmpUserId !== ''
  }

  issetUserBearer() {
    const tmpUserBearer = this.getUserBearer()
    return tmpUserBearer && tmpUserBearer !== null && tmpUserBearer !== 'null' && tmpUserBearer !== ''
  }

  tokenIsValid() {
    const tmpUserBearerEnding = this.getUserBearerEnding()
    return tmpUserBearerEnding && tmpUserBearerEnding !== null && tmpUserBearerEnding !== 'null' && tmpUserBearerEnding !== '' && Date.now() <= (new Date( tmpUserBearerEnding ).getTime())
  }

  needToRefreshToken() {
    const tmpUserBearerEnding = this.getUserBearerEnding()
    return Date.now() > ( (new Date( tmpUserBearerEnding ).getTime()) - config.timeToRefreshToken )
  }

  decodeToken (token) {
    if ( token && token !== '' ) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } else {
      return token
    }
  }

}
