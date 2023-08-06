import publishToRabitmq from "infra/libs/publishToRabitmq";
import mongoose from "mongoose";
import InvalidPayloadError from "interfaces/http/errors/InvalidPayload";
import BaseRepository from "./BaseRepository";

class NetworkRepository extends BaseRepository {
  constructor({
    cache,
    neo4jDriver,
    elasticClient,
    actorGrpcClient,
    models: { Dummy },
    tracing: { tracer, logSpanError, traceMongoQuery },
  }) {
    super({ Model: Dummy });
    this.Todo = Dummy;
    this.tracer = tracer;
    this.logSpanError = logSpanError;
    this.traceMongoQuery = traceMongoQuery;
    this.cache = cache;
    this.actorGrpcClient = actorGrpcClient;
    this.neo4jDriver = neo4jDriver;
    this.publishToRabitmq = publishToRabitmq;
    this.elasticClient = elasticClient;
  }

  /**
   * get an actor
   * @param { Object } payload
   * @returns {Promise}
   * @memberof NetworkRepository
   */
  async getActor(actorId, span) {
    return new Promise(async (resolve, reject) => {
      const parentSpan = this.tracer.startSpan("NetworkRepository.getActor", { childOf: span });
      parentSpan.log({
        event: "method_start",
        message: "Retrieving Network Analysis for Actor.",
      });
      try {
        if (!mongoose.Types.ObjectId.isValid(actorId)) {
          throw new InvalidPayloadError("Actor id is invalid");
        }
        let result;
        const allNodes = [];
        let sourceNode;
        const allRelationships = [];
        const categoryMapping = {
          Actor: 0,
          Person: 1,
          Organization: 2,
          Location: 3,
        };
        const allCategories = [
          {
            name: "Actor",
          },
          {
            name: "Person",
          },
          {
            name: "Organization",
          },
          {
            name: "Location",
          },
        ];
        const session = this.neo4jDriver.session();
        const query = `
      MATCH (nodeA:Actor {actorId: $actor_id})-[relationship:SENT_MONEY_TO_PERSON|SENT_MONEY_TO_ORGANIZATION|SENT_MONEY_TO_LOCATION|
      RECEIVED_MONEY_FROM_PERSON|RECEIVED_MONEY_FROM_ORGANIZATION|RECEIVED_MONEY_FROM_LOCATION]->(nodeN)
      RETURN nodeA, id(nodeA) AS nodeAId, labels(nodeA) AS nodeALabels, ELEMENTId(nodeA) AS nodeAElementId,
      relationship, id(relationship) AS relationshipId, type(relationship) AS relationshipType, ELEMENTId(relationship) AS relationshipElementId, 
      nodeN, id(nodeN) AS nodeNId,ELEMENTId(nodeN) AS nodeNElementId, labels(nodeN) AS nodeNLabels, properties(relationship) AS relationshipProperties
    `;

        result = await session.run(query, { actor_id: actorId });
        if (result.records.length > 0) {
          result.records.forEach((record) => {
            const nodeA = record.get("nodeA").properties;
            const nodeAId = record.get("nodeAId").low;
            const nodeAElementId = record.get("nodeAElementId");
            const nodeALabels = record.get("nodeALabels");
            const relationship = record.get("relationship");
            const relationshipId = record.get("relationshipId").low;
            const relationshipElementId = record.get("relationshipElementId");
            const relationshipType = record.get("relationshipType");
            const nodeN = record.get("nodeN").properties;
            const nodeNId = record.get("nodeNId").low;
            const nodeNElementId = record.get("nodeNElementId");
            const nodeNLabels = record.get("nodeNLabels");
            const relationshipProperties = record.get("relationshipProperties");

            sourceNode = {
              id: nodeAId,
              elementId: nodeAElementId,
              name: nodeA.actorAccountName,
              actorId: nodeA.actorId,
              accountNumber: nodeA.actorAccountNumber,
              actorType: nodeA.actorType,
              category: categoryMapping[nodeALabels[0]],
              categoryValue: nodeALabels[0],
            };
            if (nodeNLabels[0] === "Person") {
              allNodes.push({
                id: nodeNId,
                elementId: nodeNElementId,
                name: nodeN.personAccountName,
                actorId: nodeN.actorId || null,
                accountNumber: nodeN.personAccountNumber,
                transactionCount: relationship.properties.personTransactionCount.low,
                accountType: nodeN.personAccountType,
                category: categoryMapping[nodeNLabels[0]],
                categoryValue: nodeNLabels[0],
              });
            }
            if (nodeNLabels[0] === "Organization") {
              allNodes.push({
                id: nodeNId,
                elementId: nodeNElementId,
                name: nodeN.organizationAccountName,
                actorId: nodeN.actorId || null,
                accountNumber: nodeN.organizationAccountNumber,
                transactionCount: relationshipProperties.organizationTransactionCount.low,
                accountType: nodeN.organizationAccountType,
                category: categoryMapping[nodeNLabels[0]],
                categoryValue: nodeNLabels[0],
              });
            }
            if (nodeNLabels[0] === "Location") {
              allNodes.push({
                id: nodeNId,
                elementId: nodeNElementId,
                name: nodeN.country,
                transactionCount: relationshipProperties.locationTransactionCount.low,
                accountType: nodeN.organizationAccountType,
                category: categoryMapping[nodeNLabels[0]],
                categoryValue: nodeNLabels[0],
              });
            }
            allRelationships.push({
              id: relationshipId,
              elementId: relationshipElementId,
              relationshipType,
              source: nodeAElementId,
              target: nodeNElementId,
            });
          });
          const { response } = await this.actorGrpcClient.getActor({ actorId }, span);
          const actor = JSON.parse(response);
          let actorName;
          if (actor && actor.actorType === "individual")
            actorName = `${actor.firstName} ${actor.middleName || ""} ${actor.lastName}`;
          if (actor && actor.actorType === "legal_entity") actorName = `${actor.businessName}`;

          if (actorName) sourceNode.name = actorName;
          allNodes.unshift(sourceNode);
          result = { nodes: allNodes, links: allRelationships, categories: allCategories };
        } else {
          result = null;
        }
        parentSpan.log({ event: "method_end", result: { getActor: true } });
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        parentSpan.finish();
      }
    });
  }
}

export default NetworkRepository;
