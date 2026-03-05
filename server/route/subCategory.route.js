import { Router } from "express";
import auth from "../middleware/auth.js"
import { AddCategoryController, updateCategoryController } from "../controller/category.controller.js";
import { deleteSubCategory, getSubCategoryController } from "../controller/SubCategory.Controller.js";


  export const subCategoryRouter = Router()
 subCategoryRouter.post('/create',auth,AddCategoryController)
 subCategoryRouter.get('/get',getSubCategoryController)
 subCategoryRouter.put('/update',auth,updateCategoryController)
 subCategoryRouter.delete('/delete',auth,deleteSubCategory)