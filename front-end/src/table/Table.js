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
      <div className="card border-dark mb-3">
      <div class="card-body">
      <ErrorAlert error={err} />
      <h5 class="card-title">{table.table_name}</h5>
      <ul className="list-group">
        <li className="list-group-item">{table.capacity}</li>
        <li data-table-id-status={table.table_id} className="list-group-item">{table.reservation_id ? "Occupied" : "Free"}</li>
      </ul>
      <div className="card-body">       
        <div> {table.reservation_id ? <a href="#" data-table-id-finish={table.table_id} onClick={handleFinish} className="card-link">Finish</a>  : ""}  </div>        
      </div>
      </div>
    </div>
    );
  
  

};

export default Table;