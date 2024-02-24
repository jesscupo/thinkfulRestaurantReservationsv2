import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {deleteSeating} from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert";

export const Table = ({ table }) => {
  const history = useHistory();
  const [err, setErr] = useState(null);

  //function to handle Finish button
  const handleFinish = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    setErr(null)
    const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
    if (result) {
      try {
      //delete the reservation ID from the corresponding table record (set to null)
      //update the corresponding reservation status
        await deleteSeating(table.table_id, table.reservation_Id, abortController.signal);
        history.push(`/`);
      }
      catch(error) {setErr(error)}
    return() => abortController.abort();
  }
  }

    return (
    <div className="card">
      <div className="card-body">
      <ErrorAlert error={err} />
        <p className="card-text">{table.table_name}</p>
        <p className="card-text">{table.capacity}</p>
        <p data-table-id-status={table.table_id} className="card-text">{table.reservation_id ? "Occupied" : "Free"}</p>        
        <div> {table.reservation_id ? <button data-table-id-finish={table.table_id} onClick={handleFinish} className="btn btn-warning">Finish</button>  : ""}  </div>        
      </div>
    </div>
    );
  
  

};

export default Table;