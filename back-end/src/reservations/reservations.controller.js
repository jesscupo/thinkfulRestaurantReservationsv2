const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */

//confirm that date is not a tuesday
function notATuesday(req, res, next) {
  const { data: { reservation_date, reservation_time } = {} } = req.body;
  res.locals.datetime = new Date(reservation_date + ' ' + reservation_time);
  
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
  if (res.locals.datetime  >= new Date()) {
    return next();
  }
  next({
    status: 400,
    message: `The reservation date is in the past.`,
  });
}

//confirm reservations exist for this day
async function reservationsExist(req, res, next) {
  //set date var as the current days date
  let date = new Date().getFullYear()+'-'+("0"+(new Date().getMonth()+1)).slice(-2)+'-'+("0"+new Date().getDate()).slice(-2);
  //if the req has a date query parameter, set the date to this instead
  if (req.query.date) {
    date = req.query.date;
  }
  const results = await service.list(date);
  //if reservations exist on this day, go to next
  if (results) {
    res.locals.reservations = results;
    return next();
  }
  //else return error
  return next({ status: 404, message: `No Reservations on this day.` });
}


async function list(req, res) {
  const results = res.locals.reservations
  //const results = await service.list(date);
  res.json({ data: results });

}

/**
 * post handler for creating new reservations
 */
async function create(req, res) {
  const results = await service.create(req.body.data);
  res.json({ data: results });
}


module.exports = {
  list: [asyncErrorBoundary(reservationsExist), asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(notATuesday), asyncErrorBoundary(dateInPast), asyncErrorBoundary(create)]
};
