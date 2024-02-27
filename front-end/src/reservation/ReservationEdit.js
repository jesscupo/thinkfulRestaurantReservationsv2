import React,  { useEffect, useState } from "react";
import { readReservation, updateReservation } from "../utils/api";
import { useParams, useHistory } from "react-router-dom";
import {formatDate} from "../utils/format-reservation-date"
import reservationValidator from ".//ReservationValidator"

function ReservationEdit() {
    let { reservationId } = useParams();
    const history = useHistory();
    const [apiError, setAPIError] = useState([undefined]);
    const [errors, setErrors] = useState([])
    const [formData, setFormData] = useState({});
    let errorsList = [];

//function to read the reservation data by ID, then load it into the form fields    
    function loadFormData() {
        const abortController = new AbortController();
        readReservation(reservationId, abortController.signal).then((reservation)=> 
        {   
            return formatDate(reservation);
        })
        .then(setFormData)
        .catch(setAPIError)
        return () => abortController.abort();
    }

//load the reservation data by ID on page load
    useEffect(loadFormData, [reservationId]);

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

    

//function for form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    let abortController = new AbortController();
    setErrors([])
    try {
      const errors = await reservationValidator(formData);
      setErrors(errors)
      if (!errors.length) {
        await updateReservation(reservationId, {
          ...formData,
          people:Number(formData.people),}, abortController)
                .then((updatedRes)=>{
                  const newDate = formatDate(updatedRes)
                  history.push(`/dashboard/?date=${newDate.reservation_date}`)
                })
      }
    }
    catch(apiError) {setAPIError(apiError)}
    return () => abortController.abort();    
    };

    //map errors to separate p elements for display
    
    if (errors.length) 
    {errorsList = errors.map((error, index) => <p  key={index} className="alert alert-danger">{error}</p>);}


  //display of form elements
return (
    <div className="container">
    <h4>Update Reservation</h4>
      <form name="edit" onSubmit={handleSubmit}>
        <div className="form-group">
          <label for="first_name">First Name</label>
          <input 
            className="form-control"
            id="first_name"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            placeholder="First Name"
            required={true}
          />
        </div>
        <div className="form-group">
          <label for="last_name">Last Name</label>
          <input  
            className="form-control"
            id="last_name"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            placeholder="Last Name"
            required={true}
          />
        </div>
        <div className="form-group">
          <label for="mobile_number">Mobile Number</label>
          <input 
            className="form-control"
            type="tel"
            id="mobile_number"
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
            placeholder="123-456-7890"
            required={true}
          />
        </div> 
        <div className="form-group">
          <label for="reservation_date">Reservation Date</label>
          <input 
            className="form-control"
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
        <div className="form-group">
          <label for="reservation_time">Reservation Time</label>
          <input 
            className="form-control"
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
        <div className="form-group">
          <label for="people">People</label>
          <input
            className="form-control"
            id="people"
            name="people"
            type="number"
            onChange={handleChange}
            value={formData.people}
            placeholder="#"
            required={true}
          />
        </div>
        <div className="container">
            <button className="btn btn-primary" type="submit">Submit</button>
            <button onClick={handleCancel} className="btn btn-warning">Cancel</button>
        </div>
        <div className="container">
          {errorsList}
        </div>
      </form>
      </div>
    );
  }

export default ReservationEdit;