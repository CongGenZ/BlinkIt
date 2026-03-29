import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../layout/Dashboard";
import UserMenuMbile from "../pages/UserMenuMbile";
import Profile from "../pages/Profile";
import Address from "../pages/Address";
import MyOrders from "../pages/MyOrders";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import Product from "../pages/Product";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermision from "../layout/AdminPermision";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import ProductListPage from "../components/ProductListPage";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";

const router = createBrowserRouter(
    [
       {
         path : "/",
         element : <App/>,
         children:[
             {
                path:"",
                element:<Home/>
             },
             {
                path:"search",
                element:<SearchPage/>
             },
             {
                path:"login",
                element:<Login/>
             },
             {
                path:"register",
                element:<Register/>
             },
             {
               path:"forgot-password",
               element:<ForgotPassword/>
             },
             {
               path:"verification-otp",
               element:<OtpVerification/>
             },
             {
               path:"reset-password",
               element:<ResetPassword/>
             },
              
              {
                path:"user",
                element:<UserMenuMbile/>
              },
              {
                path : "dashboard",
                element : <Dashboard/>,
                children:[
                  {
                    path:"profile",
                    element:<Profile/>
                  },
                  {
                        path : "myorders",
                        element : <MyOrders/>
                    },
                    {
                        path : "address",
                        element : <Address/>
                    },
                    {
                        path : 'category',
                       element : <AdminPermision><CategoryPage/></AdminPermision>
                    },
                    {
                      path:'SubCategory',
                      element:<AdminPermision><SubCategoryPage/></AdminPermision>
                    },
                    {
                    path:'upload-product',
                    element: <AdminPermision><UploadProduct/></AdminPermision>
                    },
                    {
                      path:'product',
                      element:<AdminPermision><ProductAdmin/></AdminPermision>
                    }
                ]
              },
              {
                path : ":category",
                children : [
                    {
                        path : ":subCategory",
                        element : <ProductListPage/>
                    }
                ]
              },
              {
                path : "product/:product",
                element : <ProductDisplayPage/>
            },
            {
              path : "checkout",
              element : <CheckoutPage/>
            },
            {
              path : "success",
              element : <Success/>
            },
            {
              path : "cancel",
              element : <Cancel/>
            }
            //  {
            //     path : "user",
            //     element : <UserMenuMobile/>
            // },
          ]
       }
          
    ]
)
export default router