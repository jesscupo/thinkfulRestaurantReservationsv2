import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../reservation/Reservation"
import Table from "../table/Table"
import { Link } from "react-router-dom";
import {previous, next} from "../utils/date-time"
import sortReservationsByTime from "../utils/sortReservationsByTime"
import sortTablesByName from "../utils/sortTablesByName"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard( {date} ) {

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

//on page load, load list of reservations and tables
  useEffect(loadDashboard, [date]);
  useEffect(loadTables, [date]);

//function to load reservations
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError)
    return () => abortController.abort();
  }

//function to load tables
  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError)
    return () => abortController.abort();
  }

//sort reservations by time; sort tables by name
  reservations.sort(sortReservationsByTime)
  tables.sort(sortTablesByName)

  //convert the reservations list to individual reservation cards
  const resList = reservations.map((reservation) => <Reservation key={reservation.reservation_id} reservation ={reservation} />);
  const tableList = tables.map((table) => <Table key={table.table_id} table ={table} />);

  //set vars for the next and previous days
  const nextDay = next(date);
  const prevDay = previous(date);

  return (
    <main>
      <div class="vstack gap-3">
      <div className="container">
      <h2>Dashboard</h2>
      <h4 className="row">Reservations: {date}</h4> 
        {!resList.length ?  <h6 className="font-weight-light">No reservations on this day.</h6>
                        : ""}
        <ErrorAlert error={reservationsError} />
        {resList}
      </div>
      <div className="container">
        <h4 className="row">Tables</h4>
        <ErrorAlert error={tablesError} />
        {tableList}
      </div>
     <div className="container">
     <Link to={`/dashboard/?date=${prevDay}`} className="btn btn-primary">Previous Day</Link>
     <Link to={`/dashboard/?date=${nextDay}`} className="btn btn-primary">Next Day</Link>
    </div>
    </div>
    </main>
  );
}

export default Dashboard;
