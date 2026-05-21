import { Router } from "express";
import { CategoryController } from '../controllers/category.controller.js';
import { Protect, RestrictTo } from '../middleware/auth.middleware.js';
import { Role } from "@prisma/client";

const router = Router();

// Public routes
router.get("/", CategoryController.getAllCategories);
router.get("/:slug", CategoryController.getCategoryBySlug);

// Protected Admin routes
router.use(Protect, RestrictTo(Role.ADMIN));

router.post("/", CategoryController.createCategory);
router.patch("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

export default router;
