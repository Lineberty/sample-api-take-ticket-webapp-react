// GLOBAL URL
const linebertyServer = 'https://api-booking.lineberty.net/'
const linebertyApiVersion = 'v1'
const yourServerUrl = 'http://localhost:3059/api/v1/lineberty/'

// ROUTE ON YOUR SERVER
export const getApiKey = yourServerUrl + 'apiKey'
export const createUser = yourServerUrl + 'create'
export const logUser = yourServerUrl + 'login'
export const refreshToken = yourServerUrl + 'refreshToken'

// ROUTE FOR LINEBERTY SERVER
export const getPlaces = linebertyServer + linebertyApiVersion + '/places'
export const getQueues = linebertyServer + linebertyApiVersion + '/queues'
export const getTickets = linebertyServer + linebertyApiVersion + '/user/tickets'
export const getQueuesOfPlace = linebertyServer + linebertyApiVersion + '/places/{placeId}/queues'
export const getQueueAvailability = linebertyServer + linebertyApiVersion + '/queues/{queueId}/appointmentTypes/{appointmentTypeId}/groupSize/{select-groupSize}/availabilities'
export const bookingTicket = linebertyServer + linebertyApiVersion + '/queues/{queueId}/ticket'
export const cancelTicket = linebertyServer + linebertyApiVersion + '/user/tickets/{ticketId}/cancel'

/*
export const postponeTicket = linebertyServer + linebertyApiVersion + '/user/tickets/{ticketId}/postpone'
export const getQueuesState = linebertyServer + linebertyApiVersion + '/queues/state'
export const getQueuesEligibility = linebertyServer + linebertyApiVersion + '/queues/eligibility'
export const rateTicket = linebertyServer + linebertyApiVersion + '/user/tickets/{ticketId}/rate'
*/

// CONFIG
export const defaultLang = 'en_US'
export const timeToRefreshToken = 1000 * 60 * 5 // 5 min
export const sourceBookingTicket = 'WEB_APP_SDK_TEST'

