/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL="postgres://fmhtvhgo:Cz3oJZZvwJRxWv59Cl2-j6OcT6XaDUXi@bubble.db.elephantsql.com/fmhtvhgo",
  DATABASE_URL_DEVELOPMENT="postgres://wfpkfehc:NFqHGImGTe8lWttfzDE_OwA1hJ28v2eb@bubble.db.elephantsql.com/wfpkfehc",
  DATABASE_URL_TEST="postgres://jpblgbic:3w9P8gUToIoOd5Sd94JDCDutLih9L_XX@bubble.db.elephantsql.com/jpblgbic",
  DATABASE_URL_PREVIEW="postgres://ojntndzl:J1E67FVRanFt5LNeBVAfj-myjHEjh06m@bubble.db.elephantsql.com/ojntndzl",  
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
