const knex = require("../db/connection");

//get all reservations for a given date
function list(date) {
    return knex("reservations").select("*")
    .where("reservation_date", date)
    .whereNot("status", "finished")
  }

function read(reservationId) {
  return knex("reservations").select("*")
  .where("reservation_id", reservationId)
}

//create new reservation
function create(reservation) {
    return knex("reservations")
            .insert(reservation)
            .returning("*")
            .then((results) => results[0])
  }
  
//update reservation status
function updateStatus(reservationId, updatedRes) {
  return knex("reservations")
  .where({ reservation_id: reservationId })
  .update(updatedRes, ["*"])
  .then((updatedRes) => updatedRes[0]);
}


module.exports = {
    updateStatus,
    read,
    list,
    create,
  };
  