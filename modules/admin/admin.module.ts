import { Router } from "express";
import { AdminController } from "./admin.controller";
// import admin middlewares

const router = Router();

// import all routes here
// login
router.post("/login",
    // validate({ body: loginSchema }),
    // authLimiter,
    AdminController.login
);

// get all shops
router.get("/shops",
    // authMiddlewares.isAdmin,
    // validate({ query: getShopsSchema }),
    AdminController.getAllShops
);

// get unapproved shops

// approve a shop

// ban a shop

// unban a shop

export const adminModule = router