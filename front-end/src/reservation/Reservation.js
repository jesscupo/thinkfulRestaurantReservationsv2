import React from "react";

export const Reservation = ({ reservation }) => {

  /*
  const handleDelete = async () => {
    const result = window.confirm("Are you sure you want to delete this card?");
    if (result) {
      await deleteCard(cardId);
    }
    history.go(0);
  };
*/
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
      </div>
    </div>
    );
  
  

};



export default Reservation;