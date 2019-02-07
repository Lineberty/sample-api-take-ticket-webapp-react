import React from 'react';
import * as config from '../../../services/config.js'

function AppointmentType (props) {
  return (
    <div className="list-item" onClick={() => props.onClick() }>
      {props.appointmentType.name[ config.defaultLang ]}
    </div>
  );
}

export function AppointmentTypes (props) {

  let getAppointmentTypeList = []
  for( const k in props.appointmentTypes ) {
    getAppointmentTypeList.push(
      <AppointmentType
        key={props.appointmentTypes[k].appointmentTypeId}
        appointmentType={props.appointmentTypes[k]}
        onClick={() => props.confirm(props.appointmentTypes[k])}
      />
    )
  }

  return (
    <div>
      <button onClick={() => props.back()} className="button backButton primary">Back</button>
      <h2> Select the subject of your visit </h2>
      <div className="list"> {getAppointmentTypeList} </div>
    </div>
  )
}
