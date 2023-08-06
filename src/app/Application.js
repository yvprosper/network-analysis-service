import { asValue } from "awilix";
import GrpcServer from "interfaces/grpc/Server";
import ElasticsearchQueryManager from "infra/libs/ElasticsearchQueryManager";
import redisManager from "infra/database/redisManager";
import neo4jManager from "infra/database/neo4jManager";
import container from "src/container";

class Application {
  constructor({ restServer, database, logger, config, elasticClient }) {
    const grpcServer = new GrpcServer({ logger, config });
    this.restServer = restServer;
    this.grpcServer = grpcServer;
    this.database = database;
    this.elasticClient = elasticClient;
    this.logger = logger;
    this.config = config;
    this.index = config.get("elasticsearch.indexName");
  }

  async start() {
    if (this.database) {
      await this.database.connect();
    }
    // start and create elasticsearch index and mapping
    if (this.elasticClient) {
      try {
        await this.elasticClient.ping();

        this.logger.info("Connected to Elasticsearch");

        // create index mappings
        const elasticsearchQueryManager = new ElasticsearchQueryManager(this.elasticClient);
        await elasticsearchQueryManager.createIndex({ index: this.index }); // you can modify this method to accept multiple elasticsearch index

        this.logger.info("Elasticsearch index and mapping created if not exists");
        //  logger.info("Error creating index");
      } catch (error) {
        this.logger.info("elasticsearch cluster is down!");
        throw error;
      }
    }
    if (redisManager) {
      const redisClient = await redisManager({ config: this.config, logger: this.logger });

      container.register({
        cache: asValue(redisClient),
      });
    }
    if (neo4jManager) {
      const driver = await neo4jManager({ config: this.config, logger: this.logger });

      container.register({
        neo4jDriver: asValue(driver),
      });
    }
    await this.restServer.start();
    await this.grpcServer.start();
  }
}

export default Application;
