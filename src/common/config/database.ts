import { DataSource } from "typeorm";
import ConsumptionEntity from "../../consumption/consumption.entity";
import { database } from "./constants";

export default new DataSource({
  type: "postgres",
  host: database.hostname,
  port: database.port,
  username: database.username,
  password: database.password,
  database: database.name,
  entities: [ConsumptionEntity],
  synchronize: true,
});
