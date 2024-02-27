import React, { useState, useEffect } from "react";
import { listTables, updateTable } from "../utils/api";
import { useHistory, useParams} from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";


function TableSeat() {
//get reservation ID from URL params
  const { reservationId } = useParams();

  const history = useHistory();
//form is blank to start
  const initialFormState = {
    table_id: ''
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [errors, setErrors] = useState([])
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

//set form data on change
  const handleChange = ({ target }) => {
    setErrors([])
    setFormData({
      ...formData,
      [target.name]: target.value,
    });

  };

//on cancel, go back to the previous page
  const handleCancel = async (event) => {
    event.preventDefault();
    history.goBack()
  }

//load tables list on load  
  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }, []);


    let tableList = []
    //create select elements from table list
  // if (tables.length) 
  // {tableList = tables.map((table, index) => <option  value={table.table_id} key={index}>{table.table_name} - {table.capacity}</option>);}
    

  //on submit, save the new reservation and then redirect to the /dashboard page
  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    //initialize errors to empty again
    setErrors([])
    //update table to add reservation_id, update corresponding reservation status
    try {
    await updateTable(formData.table_id, {reservation_id: reservationId}, abortController.signal)
    history.push(`/`)
    }
    catch(error) {setErrors(errors => [...errors, error.message]) }
    return () => abortController.abort();
  }

  //map errors to separate p elements for display
  let errorsList = [];
  if (errors.length) 
  {errorsList = errors.map((error, index) => <p  key={index} className="alert alert-danger">{error}</p>);}


  //display of form elements
  return (
  <div className="container">
  <h4>Seat Reservation</h4>
  <form name="create" onSubmit={handleSubmit}>
    <div className="form-group">
      <label for="table_id">Table Number</label>
      <select
            className="form-control"
            id="table_id"
            name="table_id"
            onChange={handleChange}
            required={true}
            defaultValue="none"
            >
            <option value="none" disabled hidden></option>
            {tables.map((table, index) => 
            <option  value={table.table_id} 
                      key={index}>{table.table_name} - {table.capacity}
                      </option>)}
      </select>
    </div>
    <div className="container">
        <button className="btn btn-primary" type="submit">Seat</button>
        <button onClick={handleCancel} className="btn btn-warning">Cancel</button>
    </div>
    <div className="container">
        {errorsList}
    </div>
    </form>
    </div>
  );
}

export default TableSeat;