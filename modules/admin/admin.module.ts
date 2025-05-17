import { Router } from "express";
import { AdminController } from "./admin.controller";
import { shopController } from "../shops/shop.controller";

// import admin middlewares
import {
    validateToken,
    isAdmin,
} from "./admin.middleware";
import { authLimiter } from "../../middlewares/auth.middleware";

const router = Router();

// import all routes here
// login
router.post("/login",
    // validate({ body: loginSchema }),
    authLimiter,
    AdminController.login
);

// get all users
router.get("/users",
    validateToken,
    isAdmin,
    AdminController.getAllUsers
);

// get all shops
router.get("/shops",
    validateToken,
    isAdmin,
    AdminController.getAllShops
);

// get shop details
router.get("/shops/:shopId",
    validateToken,
    isAdmin,
    AdminController.getShop
);

// get unapproved shops
router.get("/unapproved-shops",
    validateToken,
    isAdmin,
    AdminController.getUnapprovedShops
);

// approve a shop
router.post("/shops/:shopId/approve",
    validateToken,
    isAdmin,
    AdminController.approveShop
);

// reject a shop
router.post("/shops/:shopId/reject",
    validateToken,
    isAdmin,
    AdminController.rejectShop
);

// ban a shop
router.post("/shops/:shopId/ban",
    validateToken,
    isAdmin,
    AdminController.banShop
);

// unban a shop
router.post("/shops/:shopId/unban",
    validateToken,
    isAdmin,
    AdminController.unbanShop
);

export const adminModule = router