/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/").get(controller.list).post(controller.create)

router.route("/:tableId/seat").delete(controller.delete).put(controller.update)

router
  .route("/:tableId")
  .get(controller.read)


module.exports = router;
