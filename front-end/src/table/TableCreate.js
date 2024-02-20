import React, { useState } from "react";
import { createTable } from "../utils/api";
import { useHistory } from "react-router-dom";

function TableCreate() {

  const history = useHistory();
//form is blank to start
  const initialFormState = {
    table_name: '',
    capacity: ''
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  const [errors, setErrors] = useState([])

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
    history.goBack()
  }


  //on submit, save the new reservation and then redirect to the /dashboard page
  const handleSubmit = async (event) => {
    event.preventDefault();

    //initialize errors to empty again
    setErrors([])
    //validate table name is > 2 chars
    if (formData.table_name.length < 2) {
      setErrors(errors => [...errors,"Table name must be at least two characters."] );
       }
    //validate table capacity is at least 1
    if (formData.capacity <= 1) {
      setErrors(errors => [...errors,"Table capacity must be at least one."] ); 
    }


    createTable(formData).then((newTable)=>
    { console.log(newTable)
      //restore form to blank
      setFormData({ ...initialFormState });
      //redirect to dashboard
      history.push(`/dashboard/`)
      //log api errors
    }).catch((error) => {console.log(error) })

  };

  //map errors to separate p elements for display
  let errorsList = [];
  if (errors.length) 
  {errorsList = errors.map((error, index) => <p  key={index} className="alert alert-danger">{error}</p>);}


  //display of form elements
  return (
  <div className="container">
<h2>Create Reservation</h2>
    <form name="create" onSubmit={handleSubmit}>
      <table>
      <thead>
          <tr>
            <th>Table Name</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> 
          <input
            id="table_name"
            name="table_name"
            onChange={handleChange}
            value={formData.table_name}
            placeholder="Table Name"
            required={true}
          />
        </td>
        <td> 
          <input
            id="capacity"
            name="capacity"
            onChange={handleChange}
            value={formData.capacity}
            placeholder="Capacity"
            required={true}
          />
        </td>      
            <td>
              <button className="btn btn-primary" type="submit">Create</button>
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

export default TableCreate;