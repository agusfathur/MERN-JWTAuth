import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      // hanya menampilkan field ini
      attributes: ["id", "name", "email"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;

  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan confirm password tidak cocok" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    Users.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.json({ msg: "Register berhasil!" });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });

    const macth = await bcrypt.compare(req.body.password, user[0].password);
    if (!macth) return res.status(400).json({ msg: "Wrong Password!" });

    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;

    // buat accessToken
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15s",
      }
    );

    // buat refreshToken
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // menambahkan / update data refresh_token ke record
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    // menambahkan cookie refreshToken
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure : true
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "email tidak ditemukan" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!user[0]) return res.sendStatus(204);

  const userId = user[0].id;

  // update data refresh_token menjadi null di database
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );

  // hapus cookie refreshToken
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
