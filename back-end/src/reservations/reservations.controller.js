const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//confirm that reservation ID exists
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId)
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  else {  next({
      status: 404,
      message: `${reservationId} is not valid.`,
    });}
}


//confirm all necessary fields are filled in
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Reservation must include a ${propertyName}` });
  };
}

//confirm that date is not a tuesday
function notATuesday(req, res, next) {
  const { data: { reservation_date, reservation_time, people, status } = {} } = req.body;
  res.locals.datetime = new Date(reservation_date + ' ' + reservation_time);
  res.locals.time = reservation_time;
  res.locals.people = people;
  res.locals.status = status;
  if (res.locals.datetime.getDay() != 2) {
    return next();
  }
  next({
    status: 400,
    message: `The restaurant is closed on Tuesdays.`,
  });
}

//confirm date is not in the past
function dateInPast(req, res, next) {
  if (res.locals.datetime >= new Date()) {
    return next();
  }
  next({
    status: 400,
    message: `The reservation_date or reservation_time must be in the future.`,
  });
}

//confirm time is in allowed range
function validTimes(req, res, next) {
  if (res.locals.time >= "10:30:00" && res.locals.time <= "21:30:00") {
    return next();
  }
  next({
    status: 400,
    message: `Invalid reservation time.`,
  });
}


//confirm people is numeric
function validPeople(req, res, next) {  
  const peopleNum = res.locals.people;
  if (isNaN(Number(peopleNum))) {
    return next({
      status: 400,
      message: `people must be a number`,
    });
  }
  else {return next();}
}


/**
 * List handler for reservation resources
 */

async function list(req, res) {
  //if phone number in query, use the service to get results by phone number
    if (req.query.mobile_number) {
    const phoneNumber = req.query.mobile_number;
    const results = await service.getByPhone(phoneNumber.replace(/-/g,""));
    res.json({ data: results }); 
  }
  //otherwise, use today's date or get the date from the query
  let date = new Date().getFullYear()+'-'+("0"+(new Date().getMonth()+1)).slice(-2)+'-'+("0"+new Date().getDate()).slice(-2);
  if (req.query.date) {
    date = req.query.date;
  }
  const results = await service.list(date);
  res.json({ data: results});
}


//read handler for reading one reservation by ID
async function read(req, res) {
  const reservation = res.locals.reservation
  res.status(200).json({data:reservation})
}

/**
 * post for creating new reservations
 */
async function create(req, res) {
  const results = await service.create(req.body.data);
  res.status(201).json({data: results});
}

//validate status for creating a new reservation
async function validateStatusNew(req, res, next) {
  const { data: { status } = {} } = req.body;
  if (!status) {return next()}
  if(['booked', 'cancelled'].includes(status)) {
    return next()
  }
  else {return next({
    status: 400,
    message: `status must be booked, status is ${status} or unknown`})}
}

//validate status for updating existing reservation
async function validateStatusExisting(req, res, next) {
  const { data: { status } = {} } = req.body;
  const { reservationId } = req.params;
  const existingReservation = await service.read(reservationId)
  if(existingReservation.status === "finished") {
    return next({
      status: 400,
      message: `finished status cannot be changed`})
  }
  else if(["booked", "seated", "finished", "cancelled"].includes(status)) {
    return next()
  }
  else {return next({
    status: 400,
    message: `status must be booked, seated or finished. status is ${status} or unknown`})}
}



//update reservation with new data
async function update(req, res) {
  const { reservationId } = req.params;
  const { data: { status } = {} } = req.body;
  
  const newData = {
      ...req.body.data
      };
  await service.update(reservationId, newData);
  const newReservation = await service.read(reservationId)
  res.status(200).json({ data: newReservation });
}


module.exports = {
  updateStatus: [asyncErrorBoundary(reservationExists),
                asyncErrorBoundary(validateStatusExisting),
                asyncErrorBoundary(update)],
  update: [
    asyncErrorBoundary(reservationExists),
    bodyDataHas("first_name"), 
    bodyDataHas("last_name"), 
    bodyDataHas("mobile_number"), 
    bodyDataHas("reservation_date"), 
    bodyDataHas("reservation_time"), 
    bodyDataHas("people"), 
    asyncErrorBoundary(notATuesday), 
    asyncErrorBoundary(dateInPast), 
    asyncErrorBoundary(validTimes), 
    asyncErrorBoundary(validPeople),
    asyncErrorBoundary(update),
    ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  list: asyncErrorBoundary(list),
  create: [
    bodyDataHas("first_name"), 
    bodyDataHas("last_name"), 
    bodyDataHas("mobile_number"), 
    bodyDataHas("reservation_date"), 
    bodyDataHas("reservation_time"), 
    bodyDataHas("people"), 
    asyncErrorBoundary(notATuesday), 
    asyncErrorBoundary(dateInPast), 
    asyncErrorBoundary(validTimes), 
    asyncErrorBoundary(validateStatusNew),
    asyncErrorBoundary(validPeople),
    asyncErrorBoundary(create),
      ]

};
