import { Router } from "express";
import { renderCartC, renderCommentsC, renderProductsC } from "../controllers/views/viewsController.js";
import { isLogged, isUsser } from "../utils/users.midleware.js";

const viewsRouter = Router()

viewsRouter.get("/products", isLogged, (req, res) => renderProductsC(req, res))

viewsRouter.get("/cart/", isUsser, async (req, res) => renderCartC(req, res))

viewsRouter.get("/comments/", isUsser, async(req, res) => renderCommentsC(req, res))

viewsRouter.get("/createAccount", (_req, res) => res.render("createAccount"))
viewsRouter.get("/login", (_req, res) => res.render("login"))


export default viewsRouter
