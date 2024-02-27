import React, { useState } from "react";
import { createTable } from "../utils/api";
import { useHistory } from "react-router-dom";
import tableValidator from ".//TableValidator"

function TableCreate() {

  const history = useHistory();
//form is blank to start
  const initialFormState = {
    table_name: '',
    capacity: ''
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [apiError, setAPIError] = useState([undefined])
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
    let abortController = new AbortController();
    //initialize errors to empty again
    setErrors([])    

    try {
      const errors = await tableValidator(formData);
      setErrors(errors)
      if (!errors.length) {
        await createTable({
          ...formData,
          capacity:Number(formData.capacity),}, abortController.signal)
                .then((newTable)=>{
                  history.push(`/`)
                })
          }
    }
    catch(apiError) {setAPIError(apiError)}
    return () => abortController.abort();    
    };

  //map errors to separate p elements for display
  let errorsList = [];
  if (errors.length) 
  {errorsList = errors.map((error, index) => <p  key={index} className="alert alert-danger">{error}</p>);}


  //display of form elements
  return (
  <div className="container">
    <h4>Create Table</h4>
    <form name="create" onSubmit={handleSubmit}>
      <div class="form-group">
        <label for="table_name">Table Name</label>
        <input
            class="form-control"
            id="table_name"
            name="table_name"
            onChange={handleChange}
            value={formData.table_name}
            placeholder="Table Name"
            required={true}
          />
      </div>
      <div class="form-group">
        <label for="capacity">Capacity</label>
        <input
            class="form-control"
            id="capacity"
            type="number"
            name="capacity"
            onChange={handleChange}
            value={formData.capacity}
            placeholder="Capacity"
            required={true}
          />
      </div>
      <div class="container">
          <button className="btn btn-primary" type="submit">Create</button>
          <button onClick={handleCancel} className="btn btn-warning">Cancel</button>
      </div>
      <div class="container">
        {errorsList}
      </div>
    </form>
    </div>
  );
}

export default TableCreate;