const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */

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
  create: [asyncErrorBoundary(create)]
};
