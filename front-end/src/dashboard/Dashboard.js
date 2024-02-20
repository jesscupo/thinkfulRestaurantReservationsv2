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

  useEffect(loadDashboard, [date]);
  useEffect(loadTables, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError)
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError)
    return () => abortController.abort();
  }

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
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <main className="container">
      <section className="row">{resList}</section>
     </main>
     <ErrorAlert error={tablesError} />
     <main className="container">
      <section className="row">{tableList}</section>
     </main>
     <Link to={`/dashboard/?date=${prevDay}`} className="btn btn-primary">Previous Day</Link>
     <Link to={`/dashboard/?date=${nextDay}`} className="btn btn-primary">Next Day</Link>
    </main>
  );
}

export default Dashboard;
