import React, { useState } from "react";
import { listReservations } from "../utils/api";
import Reservation from "../reservation/Reservation"

function Search() {

//form is blank to start
  const initialFormState = {
    mobile_number: '',
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  const [errors, setErrors] = useState([])

//set form data on change
  const handleChange = ({ target }) => {
    setErrors([])
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };


  //on submit, return search results by phone number and populate into searchResults
  const handleSubmit = async (event) => {
    event.preventDefault();

    listReservations({mobile_number: formData.mobile_number.replace(/-/g,"")}).then((results)=>
    setSearchResults(results))
    .catch(setSearchError)
  };

  //map errors to separate p elements for display
  let errorsList = [];
  if (errors.length) 
  {errorsList = errors.map((error, index) => <p  key={index} className="alert alert-danger">{error}</p>);}

  //create reservation elements for list of results
  const resList = searchResults.map((reservation) => <Reservation key={reservation.reservation_id} reservation ={reservation} />);


  //display of form elements
  return (
  <div className="container">
  <h4>Search Reservations by Phone Number</h4>
    <form name="create" onSubmit={handleSubmit}>
      <div className="form-group">
        <label for="mobile_number">Mobile Number</label>
        <input 
            className="form-control"
            type="tel"
            id="mobile_number"
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
            placeholder="Enter a customer's phone number"
            required={true}
          />
      </div>
      <div className="container">
        <button className="btn btn-primary" type="submit">Find</button>
      </div>
      <div className="container">
        {errorsList}
      </div>
    </form>
    <div className="container">
      <section className="row">{resList.length>0 ? resList : "No reservations found"}</section>
     </div>
    <div className="container">
        {searchError}
    </div>
    </div>
  );
}

export default Search;