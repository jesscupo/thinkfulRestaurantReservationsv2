import React from "react";
import { Link } from "react-router-dom";

export const Reservation = ({ reservation }) => {

    return (
    <div className="card">
      <div className="card-body">
        <p className="card-text">{reservation.first_name}</p>
        <p className="card-text">{reservation.last_name}</p>
        <p className="card-text">{reservation.mobile_number}</p>
        <p className="card-text">{reservation.reservation_date}</p>
        <p className="card-text">{reservation.reservation_time}</p>
        <p className="card-text">{reservation.people}</p>
        <p className="card-text">{reservation.updated_at}</p>
        <p className="card-text">{reservation.created_at}</p>
        <p data-reservation-id-status={reservation.reservation_id} className="card-text">{reservation.status}</p>
        <div> {reservation.status === 'booked' 
              ? <Link to={`/reservations/${reservation.reservation_id}/seat`} className="btn btn-primary">Seat</Link>    
              : "" }
        </div>
     </div>
    </div>
    );
  
  

};



export default Reservation;