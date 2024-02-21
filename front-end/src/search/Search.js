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
<h2>Search by Phone Number</h2>
    <form name="create" onSubmit={handleSubmit}>
      <table>
      <thead>
          <tr>
            <th>Mobile Number</th>
          </tr>
        </thead>
        <tbody>
          <tr>
        <td> 
          <input type="tel"
            id="mobile_number"
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
            placeholder="Enter a customer's phone number"
            required={true}
          />
        </td> 
            <td>
              <button className="btn btn-primary" type="submit">Find</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        {errorsList}
        </div>
    </form>
    <main className="container">
      <section className="row">{resList}</section>
     </main>
    <div>
        {searchError}
    </div>
    </div>

  );
}

export default Search;