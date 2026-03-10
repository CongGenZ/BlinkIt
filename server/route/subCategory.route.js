import { Router } from "express";
import auth from "../middleware/auth.js"

import {AddSubCategoryController, deleteSubCategory, getSubCategoryController, updateSubCategoryController}   from '../controller/SubCategory.Controller.js'

  export const subCategoryRouter = Router()
 subCategoryRouter.post('/create',auth,AddSubCategoryController)
 subCategoryRouter.get('/get',getSubCategoryController)
 subCategoryRouter.put('/update',auth,updateSubCategoryController)
 subCategoryRouter.delete('/delete',auth,deleteSubCategory)