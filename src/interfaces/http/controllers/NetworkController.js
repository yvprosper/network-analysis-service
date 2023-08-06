// import _pick from "lodash/pick";
import HTTP_STATUS from "http-status-codes";
import BaseController from "./BaseController";

class NetworkController extends BaseController {
  constructor({ networkRepository }) {
    super();
    this.networkRepository = networkRepository;
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns { Promise}
   * @memberof NetworkController
   */
  async getActorNetwork(req, res) {
    const { actorId } = req.params;
    const response = await this.networkRepository.getActor(actorId, req.span);
    // send response
    this.responseManager
      .getResponseHandler(res)
      .onSuccess(response, "Actor Network Analysis Retrieved successfully!", HTTP_STATUS.OK);
  }
}

export default NetworkController;
