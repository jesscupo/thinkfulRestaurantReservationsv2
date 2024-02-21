import React, { useState, useEffect } from "react";
import { listTables, updateTable, updateReservationStatus } from "../utils/api";
import { useHistory, useParams} from "react-router-dom";
import sortTablesByName from "../utils/sortTablesByName"
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

//get list of tables for select list
  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError)
    return () => abortController.abort();
  }

//on page load, load the tables for select list, sort the list by name
  useEffect(loadTables);
  tables.sort(sortTablesByName)
  let tableList = []
  //create select elements from table list
  if (tables.length) 
  {tableList = tables.map((table, index) => <option  value={table.table_id} key={index}>{table.table_name} - {table.capacity}</option>);}
  

  //on submit, save the new reservation and then redirect to the /dashboard page
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    //initialize errors to empty again
    setErrors([])
    //update table to add reservation_id
    updateTable(formData.table_id, {reservation_id: reservationId}).then((newSeating)=>
    { 
      //update reservation status to seated
      updateReservationStatus(reservationId, {status: "seated"})
                      .catch((apiErr) => {console.log(apiErr)})
      //restore form to blank
      setFormData({ ...initialFormState });
      //redirect to dashboard
      history.push(`/dashboard/`)
      //log api errors
    }).catch((apiErr) => {console.log(apiErr); setErrors(errors => [...errors, apiErr.message]) })
    }


  //map errors to separate p elements for display
  let errorsList = [];
  if (errors.length) 
  {errorsList = errors.map((error, index) => <p  key={index} className="alert alert-danger">{error}</p>);}


  //display of form elements
  return (
  <div className="container">
<h2>Seat Table</h2>
<ErrorAlert error={tablesError} />
    <form name="create" onSubmit={handleSubmit}>
      <table>
      <thead>
          <tr>
            <th>Table Number</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> 
            <select
            id="table_id"
            name="table_id"
            onChange={handleChange}
            required={true}
            defaultValue="none"
            >
            <option value="none" disabled hidden></option>
            {tableList}
            </select>
        </td> 
            <td>
              <button className="btn btn-primary" type="submit">Seat</button>
              <button onClick={handleCancel} className="btn btn-warning">Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        {errorsList}
        </div>
    </form>
    </div>
  );
}

export default TableSeat;