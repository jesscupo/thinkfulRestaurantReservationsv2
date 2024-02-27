import React from "react";
import { useParams } from "react-router-dom";
import ReservationForm from ".//ReservationForm"

function ReservationEdit() {
    let { reservationId } = useParams();

  //display of form elements
return (
  <ReservationForm reservationId={reservationId} />
)
  }

export default ReservationEdit;