import { Sequelize } from "sequelize";

// koneksi ke database
const db = new Sequelize("auth_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
