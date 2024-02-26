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
<h2>Create Reservation</h2>
    <form name="create" onSubmit={handleSubmit}>
      <table>
      <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>Reservation Date</th>
            <th>Reservation Time</th>
            <th>People</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> 
          <input
            id="first_name"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            placeholder="First Name"
            required={true}
          />
        </td>
        <td> 
          <input
            id="last_name"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            placeholder="Last Name"
            required={true}
          />
        </td>      
        <td> 
          <input type="tel"
            id="mobile_number"
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
            placeholder="123-456-7890"
            required={true}
          />
        </td> 
        <td> 
          <input type="date" 
            placeholder="YYYY-MM-DD" 
            pattern="\d{4}-\d{2}-\d{2}"
            id="reservation_date"
            name="reservation_date"
            onChange={handleChange}
            value={formData.reservation_date}
            required={true}
          />
        </td>                     
        <td> 
          <input type="time" 
            placeholder="HH:MM" 
            pattern="[0-9]{2}:[0-9]{2}"
            id="reservation_time"
            name="reservation_time"
            onChange={handleChange}
            value={formData.reservation_time}
            required={true}
          />
        </td>
        <td> 
          <input
            id="people"
            name="people"
            type="number"
            onChange={handleChange}
            value={formData.people}
            placeholder="#"
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

export default ReservationCreate;