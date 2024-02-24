const knex = require("../db/connection");

//get all tables
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

//create new table
function create(table) {
    return knex("tables")
            .insert(table)
            .returning("*")
            .then((results) => results[0])
  }
  
//read one table by ID
function read(tableId) {
  return knex("tables")
          .select("*")
          .where({table_id: tableId})
          .first()
}

//update table
function update(table_id, reservation_id) {
  return knex.transaction(async (transaction) => {

  await knex("reservations")
  .where({ reservation_id })
  .update({ status: "seated" })
  .transacting(transaction);

return knex("tables")
  .where({ table_id })
  .update({ reservation_id }, "*")
  .transacting(transaction)
  .then((records) => records[0]);
});
}

//finish reservation by setting reservation ID in tables to null
//and setting reservation status to finished
function destroy({ table_id, reservation_id }) {
  return knex.transaction(async (transaction) => {

    await knex("reservations")
    .where({ reservation_id })
    .update({ status: "finished" })
    .transacting(transaction);
  
  return knex("tables")
    .where({ table_id })
    .update({ reservation_id: null})
    .transacting(transaction);
  });
}


module.exports = {
    read,
    list,
    create,
    update,
    destroy,
  };
  