const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service")


//confirm all necessary fields are filled in
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Table must include a ${propertyName}` });
  };
}


async function validateReservationID(req,res,next) {
  const {data : {reservation_id} = {} } = req.body;
  if (!reservation_id) {
      next({
        status: 400,
        message: `reservation_id missing`,
      });}
  const thisReservation = await reservationService.read(reservation_id);
  res.locals.reservation = thisReservation;
  if (thisReservation) {next()}
  else {
    next({
      status: 404,
      message: `reservation_id ${reservation_id} does not exist`,
    });
  }
}


async function validateTableId(req,res,next) {
  const { tableId } = req.params;
  const results = await service.read(tableId);
  if (results) { res.locals.table = results; 
                 next()}
  else {
    next({
      status: 404,
      message: `table_id ${tableId} does not exist`,
    });
  }
}


//check for table capacity vs. reservation size for seating
async function validateCapacityFitsRes(req, res, next) {
  const { tableId } = req.params;
  const { reservation } = res.locals;
  const table = await service.read(tableId);

//  res.locals.table = thisTable
//  res.locals.reservation = thisReservation

  if (reservation && table.capacity >= reservation.people) {
      return next();
  }
  else {return next({
    status: 400,
    message: `Table does not have sufficient capacity.`
  })}
}

//confirm table is available before seating
async function validateTableisAvailable(req, res, next) {
  const { tableId } = req.params;
  const thisTable = await service.read(tableId);
  if (thisTable.reservation_id === null) {
      return next();
  }
  next({
    status: 400,
    message: `Table is occupied.`
  })
}

//confirm table is occupied before ending reservation
async function validateTableisOccupied(req, res, next) {
  const thisTable = res.locals.table
  if (thisTable.reservation_id != null) {
      return next();
  }
  next({
    status: 400,
    message: `Table is not occupied.`
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
    message: `table_name must be at least two characters.`,
  });
}



//confirm that capacity is >=1
function validateTableCapacity(req, res, next) {
  const capacity = req.body.data.capacity;
  if (capacity && capacity > 0 && Number.isInteger(capacity)) {
    return next();
  }
  next({
    status: 400,
    message: "capacity must be at least 1 person and must be a number.",
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
  res.status(201).json({ data: results });
}

//read handler for reading one table by ID
async function read(req, res) {
  const { tableId } = req.params;
  const results = await service.read(tableId);
  res.status(200).json({data:results})
}


//put handler
async function update(req, res) {
  const {data : {reservation_id} = {} } = req.body;
  const { tableId } = req.params;

  const table = await service.read(Number(tableId));
  const reservation = await reservationService.read(reservation_id);

    const data = await service.update(
    table.table_id,
    reservation.reservation_id
  );
  res.json({
    data,
  });
}

//validate reservation status
async function validateReservationStatus(req, res, next) {
  const reservationData = res.locals.reservation;
  if (reservationData.status === "seated") {
    return next({
      status: 400,
      message: `reservation is already seated.`,
    });
  }
  else {return next()}
}


//delete seating handler
async function destroy(req, res) {
  const { table } = res.locals;
  const data = await service.destroy(table);
  res.json({ data });
}


module.exports = {
  delete: [
          asyncErrorBoundary(validateTableId),
          asyncErrorBoundary(validateTableisOccupied), 
          asyncErrorBoundary(destroy)],
  read: [asyncErrorBoundary(validateTableId), 
          asyncErrorBoundary(read)],
  update: [asyncErrorBoundary(validateReservationID),
           asyncErrorBoundary(validateCapacityFitsRes), 
           asyncErrorBoundary(validateTableisAvailable),  
          asyncErrorBoundary(validateReservationStatus),
          asyncErrorBoundary(update)],
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(bodyDataHas("table_name")),
    asyncErrorBoundary(bodyDataHas("capacity")),
    asyncErrorBoundary(validateTableName), 
    asyncErrorBoundary(validateTableCapacity),  
    asyncErrorBoundary(create)
  ]
};
