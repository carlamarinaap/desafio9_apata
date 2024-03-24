import express from "express";
import UserManager from "../dao/manager_mongo/userManager.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import userSchema from "../dao/models/user.schema.js";
import config from "../config/config.js";
import { createHash } from "../utils.js";

// import { requireJwtAuth } from "../config/passport.config.js";

const um = new UserManager();
const router = express.Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failRegister" }),
  async (req, res) => {
    res.cookie("jwt", req.user.token, {
      signed: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    // req.session.user = req.user;
    res.redirect("/products");
  }
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    if (!req.user)
      return res.status(400).send({ status: "error", error: "Invalid Credentials" });
    res
      .cookie("jwt", req.user.token, {
        signed: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      })
      .redirect("/products");
  }
);

router.post("/passwordRestore", async (req, res) => {
  let { email, password, confirm } = req.body;
  const user = await um.getUser(email);
  if (user && password && confirm && password === confirm) {
    const passwdHash = createHash(password);
    await um.updatePassword(email, passwdHash);
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  // if (req.session.user) {
  //   req.session.destroy((err) => {
  //     let msg = "Se cerró la sesión";
  //     res.render("login", { msg });
  //   });
  // } else {
  res.clearCookie("jwt");
  let msg = "Se cerró la sesión";
  res.render("login", { msg });
  // }
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallbackapata",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    res.cookie("jwt", req.user.token, {
      signed: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    res.redirect("/products");
  }
);
router.get("/current", async (req, res) => {
  let user;
  if (req.signedCookies.jwt) {
    const userId = jwt.verify(req.signedCookies.jwt, config.privateKey).id;
    user = await userSchema.findById(userId);
  }
  // if (req.session.user) {
  //   user = req.session.user;
  // }
  if (!req.signedCookies.jwt && !req.session.user) {
    res.status(400).json("Nadie logueado");
  }
  res.status(200).json(user);
});

export default router;
