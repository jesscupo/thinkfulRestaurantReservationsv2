const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service")

//check for table capacity vs. reservation size for seating
async function validateCapacityFitsRes(req, res, next) {
  const {data : {reservation_id} = {} } = req.body;
  const thisTable = res.locals.table;
  const thisReservation = await reservationService.read(reservation_id);
  if (thisTable.capacity >= thisReservation[0].people) {
      return next();
  }
  next({
    status: 400,
    message: `Table does not fit reservation size.`
  })
}

//confirm table is occupied before ending reservation
async function validateTableisOccupied(req, res, next) {
  const { tableId } = req.params
  const thisTable = await service.read(tableId);
  res.locals.table = thisTable
  if (res.locals.table.reservation_id != null) {
      return next();
  }
  next({
    status: 400,
    message: `Table is not occupied.`
  })
}

//confirm table is available before seating
async function validateTableisAvailable(req, res, next) {
  const { tableId } = req.params
  const thisTable = await service.read(tableId);
  res.locals.table = thisTable
  if (res.locals.table.reservation_id === null) {
      return next();
  }
  next({
    status: 400,
    message: `Table is occupied.`
  })
}

//confirm that table name is >= 2 chars long
function validateTableName(req, res, next) {
  const { data: { table_name } = {} } = req.body;
  if (table_name.length >= 2) {
    return next();
  }
  next({
    status: 400,
    message: `Table name must be at least two characters.`,
  });
}

//confirm that capacity is >=1
function validateTableCapacity(req, res, next) {
  const { data: { capacity } = {} } = req.body;
  if (capacity >= 1) {
    return next();
  }
  next({
    status: 400,
    message: `Capacity must be at least one.`,
  });
}

//list handler
async function list(req, res) {
  const results = await service.list();
  res.json({ data: results });
}

/**
 * post for creating new tables
 */
async function create(req, res) {
  const results = await service.create(req.body.data);
  res.json({ data: results });
}

//read handler for reading one table by ID
async function read(req, res) {
  const { tableId } = req.params;
  const results = await service.read(tableId);
  res.json({data:results})
}


//put handler
async function update(req, res) {
  const tableData = res.locals.table;
  const newSeating = {
      ...tableData,
      ...req.body.data,
      };
  await service.update(newSeating);
  const updatedSeating = await service.read(newSeating.table_id);
  res.json({ data: updatedSeating });
}

//delete seating handler
async function destroy(req, res) {
  const { tableId } = req.params;
  const tableData = await service.destroy(tableId);
  res.json({ data: tableData });
}

module.exports = {
  delete: [asyncErrorBoundary(validateTableisOccupied), asyncErrorBoundary(destroy)],
  read: asyncErrorBoundary(read),
  update: [asyncErrorBoundary(validateTableisAvailable), asyncErrorBoundary(validateCapacityFitsRes),  asyncErrorBoundary(update)],
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(validateTableCapacity), asyncErrorBoundary(validateTableName),  asyncErrorBoundary(create)]
};
