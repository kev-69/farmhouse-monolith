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
    // authMiddlewares.isAdmin,
    // validate({ query: getShopsSchema }),
    shopController.getAllShops
);

// get unapproved shops
router.get("/unapproved-shops",
    validateToken,
    isAdmin,
    AdminController.getUnapprovedShops
);

// approve a shop
router.post("/approve-shop/:shopId",
    validateToken,
    isAdmin,
    AdminController.approveShop
);

// ban a shop
router.post("/ban-shop/:shopId",
    validateToken,
    isAdmin,
    AdminController.banShop
);

// unban a shop
router.post("/unban-shop/:shopId",
    validateToken,
    isAdmin,
    AdminController.unbanShop
);

export const adminModule = router