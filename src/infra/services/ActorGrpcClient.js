import grpc from "grpc";
import { createGetActorByIdRequest } from "interfaces/grpc/requests";
import ClientServices from "stubs/tm_actors/service_grpc_pb";

const opentracing = require("opentracing");

/**
 * class ActorGrpcClient
 */
class ActorGrpcClient {
  constructor({ config, tracing: { tracer, logSpanError } }) {
    this.config = config;
    this.tracer = tracer;
    this.logSpanError = logSpanError;
    this.hostport = this.config.get("app.actorServiceGrpcHostPort");
    this.client = new ClientServices.TmActorsAPIClient(
      this.hostport,
      grpc.credentials.createInsecure()
    );
  }

  /**
   * get many actors
   * @param {*} userIdsList
   * @returns {Promise}
   *
   */
  async getActor(userIdsList, span) {
    return new Promise((resolve, reject) => {
      try {
        const traceContext = {};
        this.tracer.inject(span, opentracing.FORMAT_TEXT_MAP, traceContext);
        const metadata = new grpc.Metadata();
        metadata.add("trace", JSON.stringify(traceContext));
        const request = createGetActorByIdRequest(userIdsList);
        this.client.getActorById(request, metadata, (error, response) => {
          if (error) {
            reject(error);
            return;
          }
          const { success, response: data } = response.toObject();
          resolve({ success, response: JSON.parse(data) });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default ActorGrpcClient;
