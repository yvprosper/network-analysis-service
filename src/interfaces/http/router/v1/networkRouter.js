import express from "express";
import { makeInvoker } from "awilix-express";
import MethodNotAllowedHandler from "interfaces/http/middleware/methodNotAllowed";
import catchErrors from "interfaces/http/errors/catchErrors";
import NetworkController from "interfaces/http/controllers/NetworkController";

// const validator = require("express-joi-validation").createValidator({
//   passError: true, // NOTE: this tells the module to pass the error along for you
// });

const api = makeInvoker(NetworkController);
const router = express.Router();
// Remove the @apiIgnore tag when you duplicate this block
/**
   * @api {get} /v1/actor/:actorId/network Get Network Analysis
   * @apiGroup NetworkAnalysis
   * @apiDescription This endpoint retrieves network analysis for an actor
   * @apiName GetActorNetwork
   * @apiPermission create-todo
   * @apiVersion 1.0.0
   * @apiParam {String} actorId       id of the actor.
   * @apiSuccessExample Success Response:
   *     HTTP/1.1 201 OK
   *     {
            "success": true,
            "status_code": 201,
            "message": "Todo created successfully!",
            "data": {
                "status": "incomplete",
                "completedAt": null,
                "dueDate": null,
                "isImportant": false,
                "subject": "March Todos",
                "note": "hello",
                "attachements": [],
                "createdAt": "2021-03-30T08:24:27.652Z",
                "lastModifiedAt": "2021-03-30T08:24:27.652Z",
                "id": "6062e03b2b2fb97d46ca74df"
            },
            "links": []
          }
   *
   * @apiHeader {String} authorization Users bearer access token.
   *
   *  @apiUse MyError
  * 
   */

/* '/v1/actor/network` */
router
  .route("/:actorId/network")
  .get(catchErrors(api("getActorNetwork")))
  .all(MethodNotAllowedHandler);

module.exports = router;
