const knex = require("../db/connection");

//get all reservations for a given date
function list(date) {
    return knex("reservations").select("*")
    .where("reservation_date", date);
  }


//create new reservation
function create(reservation) {
    return knex("reservations")
            .insert(reservation)
            .returning("*")
            .then((results) => results[0])
  }
  

module.exports = {
    list,
    create,
  };
  