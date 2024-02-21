import React from "react";
import { useHistory } from "react-router-dom";
import {deleteSeating, updateReservationStatus} from "../utils/api"

export const Table = ({ table }) => {
  const history = useHistory();

  //function to handle Finish button
  const handleFinish = async () => {
    const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
    if (result) {
      try {
      //update the reservation status to Finished
      await updateReservationStatus(table.reservation_id, {status:"finished"}) }
      catch(error) {
        console.log(error)
      }
      try {
      //delete the reservation ID from the corresponding table record (set to null)
      await deleteSeating(table.table_id);}
      catch(error) {console.log(error)}

      history.go(0)

  }
  }

    return (
    <div className="card">
      <div className="card-body">
        <p className="card-text">{table.table_name}</p>
        <p className="card-text">{table.capacity}</p>
        <p data-table-id-status={table.table_id} className="card-text">{table.reservation_id ? "Occupied" : "Free"}</p>        
        <div> {table.reservation_id ? <button onClick={handleFinish} className="btn btn-warning">Finish</button>  : ""}  </div>        
      </div>
    </div>
    );
  
  

};

export default Table;