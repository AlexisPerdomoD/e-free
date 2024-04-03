import { Router } from "express";
import { auth } from "./ussers/usser.routes.js";
import { renderCartC, renderCommentsC, renderProductsC } from "../controllers/views/viewsController.js";

const viewsRouter = Router()

viewsRouter.get("/products", auth, (req, res) => renderProductsC(req, res))

viewsRouter.get("/cart/", auth, async (req, res) => renderCartC(req, res))

viewsRouter.get("/comments/", auth, async(req, res) => renderCommentsC(req, res))

viewsRouter.get("/createAccount", (req, res) => res.render("createAccount"))
viewsRouter.get("/login", (req, res) => res.render("login"))

export default viewsRouter