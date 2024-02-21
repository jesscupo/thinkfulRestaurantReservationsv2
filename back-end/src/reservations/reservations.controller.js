const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


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
  const { data: { reservation_date, reservation_time } = {} } = req.body;
  res.locals.datetime = new Date(reservation_date + ' ' + reservation_time);
  res.locals.time = reservation_time;

  if (res.locals.datetime.getDay() != 2) {
    return next();
  }
  next({
    status: 400,
    message: `The restaurant is not open on Tuesdays.`,
  });
}

//confirm date is not in the past
function dateInPast(req, res, next) {
  if (res.locals.datetime >= new Date()) {
    return next();
  }
  next({
    status: 400,
    message: `The reservation date is in the past.`,
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
  const { reservationId } = req.params;
  const results = await service.read(reservationId);
  res.json({data:results})
}

/**
 * post for creating new reservations
 */
async function create(req, res) {
  const results = await service.create(req.body.data);
  res.json({ data: results });
}

//update reservation with new data
async function update(req, res) {
  const { reservationId } = req.params;
  const newData = {
      ...req.body.data
      };
  const result = await service.update(reservationId, newData);
  res.json({ data: result });
}


module.exports = {
  update: [
    bodyDataHas("first_name"), 
    bodyDataHas("last_name"), 
    bodyDataHas("mobile_number"), 
    bodyDataHas("reservation_date"), 
    bodyDataHas("reservation_time"), 
    bodyDataHas("people"), 
    asyncErrorBoundary(notATuesday), 
    asyncErrorBoundary(dateInPast), 
    asyncErrorBoundary(validTimes), 
    asyncErrorBoundary(update)
    ],
  read: [asyncErrorBoundary(read)],
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
    asyncErrorBoundary(create)
      ]

};
