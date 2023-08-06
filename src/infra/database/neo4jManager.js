import neo4j from "neo4j-driver";

const neo4jManager = async ({ config, logger }) => {
  logger.info("Connecting to Neo4j database...");
  const password = config.get("neo4j.password");
  const username = config.get("neo4j.username");
  const host = config.get("neo4j.host");
  const driver = neo4j.driver(host, neo4j.auth.basic(username, password));
  try {
    await driver.getServerInfo();
    logger.info("Connected to Neo4j database!");
  } catch (error) {
    logger.error("Error connecting to Neo4j:", error);
  } finally {
    // Remember to close the driver when done using it.
    // This releases the resources used by the driver.
    // driver.close();
  }

  return driver;
};

// Releveant documentations - https://github.com/NodeRedis/node-redis
export default neo4jManager;
