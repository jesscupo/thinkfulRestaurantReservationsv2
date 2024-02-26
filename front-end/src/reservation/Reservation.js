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
    <div className="card">
      <div className="card-body">
      <ErrorAlert error={err} />
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
        <div> {reservation.status === 'booked' 
              ? <Link to={`/reservations/${reservation.reservation_id}/edit`} className="btn btn-primary">Edit</Link>        
              : "" }    
        </div>
        <div>
          {!["seated", "cancelled"].includes(reservation.status)
          ?<button data-reservation-id-cancel={reservation.reservation_id} onClick={handleCancel} className="btn btn-warning">Cancel</button>
          : ""}
        </div>
        
     </div>
    </div>
    );
  
  

};



export default Reservation;