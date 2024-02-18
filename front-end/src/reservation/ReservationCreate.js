import React, { useState } from "react";
import { createReservation } from "../utils/api";
import { useHistory, Link } from "react-router-dom";


function ReservationCreate() {

  const history = useHistory();
//form is blank to start
  const initialFormState = {
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: ''
  };

  const [formData, setFormData] = useState({ ...initialFormState });

//set form data on change
  const handleChange = ({ target }) => {
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
    
    createReservation(formData).then((newReservation)=>
    { 
      //restore form to blank
      setFormData({ ...initialFormState });
      //redirect to home
      history.push(`/dashboard/?date=${newReservation.reservation_date}`)
    })
    
  };

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
            required="true"
          />
        </td>
        <td> 
          <input
            id="last_name"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            placeholder="Last Name"
            required="true"
          />
        </td>      
        <td> 
          <input type="tel"
            id="mobile_number"
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
            placeholder="123-456-7890"
            required="true"
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
            required="true"
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
            required="true"
          />
        </td>
        <td> 
          <input
            id="people"
            name="people"
            onChange={handleChange}
            value={formData.people}
            placeholder="#"
            required="true"
          />
        </td>        
            <td>
              <button className="btn btn-primary" type="submit">Create</button>
              <button onClick={handleCancel} className="btn btn-warning">Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
    </div>
  );
}

export default ReservationCreate;