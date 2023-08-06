const config = {
  host: {
    doc: "neo4j host",
    format: "*",
    default: null,
    env: "NEO4J_HOST",
    sensitive: false,
  },
  username: {
    doc: "neo4j username",
    format: "*",
    default: null,
    env: "NEO4J_USERNAME",
    sensitive: true,
  },
  password: {
    doc: "neo4j password",
    format: "*",
    default: null,
    env: "NEO4J_PASSWORD",
    sensitive: true,
  },
};

exports.neo4j = config;
