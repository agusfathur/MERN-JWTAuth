import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import db from "./config/Database.js";
import router from "./routes/router.js";

const app = express();
dotenv.config();

try {
  // koneksi ke database
  await db.authenticate();
  console.log(`Database connected...`);
  // deklrasi table users, sekali saja
  // await Users.sync();
} catch (error) {
  console.log(error);
}

// agar bisa diaccess dari luar domain
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000, () => console.log(`Server running at port 5000`));
