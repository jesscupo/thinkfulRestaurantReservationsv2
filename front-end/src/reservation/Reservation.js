import React, {useState} from "react";
import { Link } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";


export const Reservation = ({ reservation }) => {
  const history = useHistory();
  const [err, setErr] = useState(null);

//handler for clicking cancel button
  const handleCancel = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    setErr(null)
    const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
    if (result) {
      try {
//update the reservation status to cancelled if user confirms dialog window        
      await updateReservationStatus(reservation.reservation_id, {status:"cancelled"}, abortController.signal )
      history.push(`/`);
      }
      catch(error) {
        setErr(error)
      }
      return() => abortController.abort();
      }
      }


    return (
    <div className="card border-dark mb-3">
      <ErrorAlert error={err} />
      <div class="card-body">
      <h5 class="card-title">{reservation.first_name} {reservation.last_name}</h5>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Mobile Number: {reservation.mobile_number}</li>
        <li className="list-group-item">Reservation Date: {reservation.reservation_date}</li>
        <li className="list-group-item">Reservation Time: {reservation.reservation_time}</li>
        <li className="list-group-item">People: {reservation.people}</li>
        <li className="list-group-item">Updated at: {reservation.updated_at}</li>
        <li className="list-group-item">Created at: {reservation.created_at}</li>
        <li className="list-group-item" data-reservation-id-status={reservation.reservation_id} >Status: {reservation.status}</li>
      </ul>
      <div className="card-body">
           {reservation.status === 'booked' 
                ? <a href={`/reservations/${reservation.reservation_id}/seat`} className="card-link">Seat</a>    
                : "" }
          {reservation.status === 'booked' 
              ? <a href={`/reservations/${reservation.reservation_id}/edit`} className="card-link">Edit</a>        
              : "" }    
          {!["seated", "cancelled"].includes(reservation.status)
              ?<a href="#" onClick={handleCancel} data-reservation-id-cancel={reservation.reservation_id} className="card-link">Cancel</a>
              : ""}              
      </div>
    </div>
    );
  
  

};



export default Reservation;