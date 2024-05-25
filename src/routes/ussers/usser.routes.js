import { Router } from "express";
import passport from "passport";
import {
  loginController,
  logoutController,
} from "../../controllers/ussers/ussersControllers.js";
import em, { ErrorCode } from "../../utils/error.manager.js";
const usserRouter = Router();
// SIGN UP
usserRouter.post(
  "/",
  passport.authenticate("register", {
    failureMessage: true,
  }),
  (req, res) => {
    loginController(req, res);
    res.send({
      ok: true,
      message: "session properly started and user created",
    });
  },
);
//sign up template view
usserRouter.post(
  "/template",
  passport.authenticate("register", {
    failureRedirect: "/api/usser/error_template",
    failureMessage: true,
  }),
  (req, res) => {
    loginController(req, res);
    res.redirect("/products");
  },
);
//login
usserRouter.post(
  "/login",
  passport.authenticate("login", {
    failureMessage: true,
  }),
  (req, res) => {
    loginController(req, res);
    res.send({
      ok: true,
      message: "session properly started",
    });
  },
);
// LOG IN template
usserRouter.post(
  "/login_template",
  passport.authenticate("login", {
    failureRedirect: "/api/usser/error_template",
    failureMessage: true,
  }),
  (req, res) => {
    loginController(req, res);
    res.redirect("/products");
  },
);
//CALL GITHUB STRATEGY, needs to use browser
usserRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);
//GITHUB STRATEGY CALLBACK
usserRouter.get(
  "/githubcb",
  passport.authenticate("github", {
    failureRedirect: "/api/usser/error",
    failureMessage: true,
  }),
  (req, res) => loginController(req, res),
);
//LOG OUT
usserRouter.get("/logout", (req, res) => {
  logoutController(req, res);
  res.send({ ok: true, message: "logged out" });
});
//LOG OUT TEMPLATE
usserRouter.get("/logout_template", (req, res) => {
  logoutController(req, res);
  res.redirect("/");
});

// AUTH ERROR CALLBACK RENDER
usserRouter.get("/error", (req, _res) => {
  throw em.createError({
    status: 400,
    message: req.session.messages
      ? req.session.messages
      : "problem detected to get credentials properly, pls try again",
    name: "CastError",
    code: ErrorCode.GENERAL_USER_ERROR,
  });
});
// auth error for template
usserRouter.get("/error_template", (req, res) => {
  res.render("error", {
    status: 401,
    message: req.session.messages
      ? req.session.messages[0]
      : "problem detected to get credentials properly, pls try again",
    redirect: "/login",
    destiny: "login",
  });
});
export default usserRouter;

usserRouter.patch("/premium", isLogged, (req, res, next) =>
  levelUpUserCtr(req, res, next),
);

// AUTHENTICATE MIDDLEWARE reference, now using users.midleware.js on utils directory
// export const auth = async (req, res, next) =>{
//     if(!req.session.ussername) return res.status(401)
//     .render("error", {
//         status:401,
//         message: "not authoritation for this route, please log in",
//         destiny:" Login",
//         redirect: "/login"
//     })
//     next()
//  }
