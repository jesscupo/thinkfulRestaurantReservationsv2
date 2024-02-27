import React, { useState } from "react";
import { createReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
import { formatDate } from "../utils/format-reservation-date"
import reservationValidator from ".//ReservationValidator"

function ReservationCreate() {

  const history = useHistory();
//form is blank to start
  const initialFormState = {
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: 0
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [apiError, setAPIError] = useState([undefined]);
  const [errors, setErrors] = useState([])

//set form data on change
  const handleChange = (e) => {
    setErrors([])
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
      const errors = await reservationValidator(formData);
      setErrors(errors)
      if (!errors.length) {
        await createReservation({
                ...formData,
                people:Number(formData.people),}
                , abortController.signal)
                .then((newRes)=>{
                  const newDate = formatDate(newRes)
                  history.push(`/dashboard/?date=${newDate.reservation_date}`)
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
  <h4>Create Reservation</h4>
    <form name="create" onSubmit={handleSubmit}>
      <div class="form-group">
        <label for="first_name">First Name</label>
        <input 
          class="form-control"
          id="first_name"
          name="first_name"
          onChange={handleChange}
          value={formData.first_name}
          placeholder="First Name"
          required={true}
        />
      </div>
      <div class="form-group">
        <label for="last_name">Last Name</label>
        <input  
          class="form-control"
          id="last_name"
          name="last_name"
          onChange={handleChange}
          value={formData.last_name}
          placeholder="Last Name"
          required={true}
        />
      </div>
      <div class="form-group">
        <label for="mobile_number">Mobile Number</label>
        <input 
          class="form-control"
          type="tel"
          id="mobile_number"
          name="mobile_number"
          onChange={handleChange}
          value={formData.mobile_number}
          placeholder="123-456-7890"
          required={true}
        />
      </div> 
      <div class="form-group">
        <label for="reservation_date">Reservation Date</label>
        <input 
          class="form-control"
          type="date" 
          placeholder="YYYY-MM-DD" 
          pattern="\d{4}-\d{2}-\d{2}"
          id="reservation_date"
          name="reservation_date"
          onChange={handleChange}
          value={formData.reservation_date}
          required={true}
        />
      </div>
      <div class="form-group">
        <label for="reservation_time">Reservation Time</label>
        <input 
          class="form-control"
          type="time" 
          placeholder="HH:MM" 
          pattern="[0-9]{2}:[0-9]{2}"
          id="reservation_time"
          name="reservation_time"
          onChange={handleChange}
          value={formData.reservation_time}
          required={true}
        />
      </div>
      <div class="form-group">
        <label for="people">People</label>
        <input
          class="form-control"
          id="people"
          name="people"
          type="number"
          onChange={handleChange}
          value={formData.people}
          placeholder="#"
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

export default ReservationCreate;