import UsserMannagerM from "../../dao/db/usserMannagerM.js";
import em, { ErrorCode } from "../../utils/error.manager.js";
const um = new UsserMannagerM();
export function loginController(req, _res) {
  req.session.ussername = req.user.email;
  req.session.name = req.user.first_name;
  req.session.rol = req.user.rol;
  req.session.cart = req.user.cart;
}

export function logoutController(req, res) {
  if (!req.session.ussername) return res.redirect("/login");
  req.session.destroy((err) => {
    if (err)
      throw em.createError({
        name: "SESION ERROR",
        message: "error while logging out",
        status: 500,
        code: ErrorCode.DATABASE_ERROR,
      });
  });
}

export async function levelUpUserCtr(req, res, next) {
  try {
    await um.updateUsser(req.session.ussername, { role: "premium" });
    return res.send({
      message: "now you are a premium user",
    });
  } catch (err) {
    next(err);
  }
}
