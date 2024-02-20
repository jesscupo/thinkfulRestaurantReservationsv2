const knex = require("../db/connection");

//get all tables
function list() {
  return knex("tables").select("*");
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
function update(updatedTable) {
  return knex("tables")
  .where({ table_id: updatedTable.table_id })
  .update(updatedTable, ["*"])
  .then((updatedTable) => updatedTable[0]);
}

function destroy(tableId) {
  return knex("tables")
  .where({ table_id: tableId })
  .update({
    reservation_id: null
})
}

module.exports = {
    read,
    list,
    create,
    update,
    destroy,
  };
  