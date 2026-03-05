import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddCategoryController, deletecategoryController, getCategoryController, updateCategoryController } from "../controller/category.controller.js";


  export  const categoryRouter = Router()

categoryRouter.post("/add-category",auth,AddCategoryController)
categoryRouter.get('/get',getCategoryController)
categoryRouter.put('/update',auth, updateCategoryController)
categoryRouter.delete('/delete', auth, deletecategoryController)
