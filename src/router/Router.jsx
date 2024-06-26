import { createBrowserRouter } from "react-router-dom";
import PrivateRouter from "./PrivateRouter";
import Root from "../pages/Root";
import Error from "../pages/Error";
import Home from "../pages/home/Home";
import Login from "../pages/loginRegister/Login";
import Register from "../pages/loginRegister/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import ContactUs from "../pages/ContactUs";
import Profile from "../pages/dashboard/Profile";
import WorkSheet from "../pages/dashboard/WorkSheet";
import EmployeeList from "../pages/dashboard/EmployeeList";
import PaymentHistory from "../pages/dashboard/PaymentHistory";
import HRRouter from "./HRRouter";
import EmployeeDetails from "../pages/dashboard/EmployeeDetails";
import Progress from "../pages/dashboard/Progress";
import EmployeeRouter from "./EmployeeRouter";
import AdminRouter from "./AdminRouter";
import AllEmployeeList from "../pages/dashboard/AllEmployeeList";
import Messages from "../pages/dashboard/Messages";

const Router = createBrowserRouter([
    {
        path: '/',
        element: <Root></Root>,
        errorElement: <Error></Error>,
        children: [
            {
                path: '/',
                element: <Home></Home>,
            },
            {
                path: '/login',
                element: <Login></Login>,
            },
            {
                path: '/register',
                element: <Register></Register>,
            },
            {
                path: '/contact-us',
                element: <ContactUs></ContactUs>,
            },
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRouter><Dashboard></Dashboard></PrivateRouter>,
        errorElement: <Error></Error>,
        children: [
            {
                path: '/dashboard',
                element: <PrivateRouter><Profile></Profile></PrivateRouter>,
            },
            {
                path: '/dashboard/work-sheet',
                element: <EmployeeRouter><WorkSheet></WorkSheet></EmployeeRouter>,
            },
            {
                path: '/dashboard/employee-list',
                element: <HRRouter><EmployeeList></EmployeeList></HRRouter>,
            },
            {
                path: '/dashboard/payment-history',
                element: <EmployeeRouter><PaymentHistory></PaymentHistory></EmployeeRouter>,
            },
            {
                path: '/dashboard/employee-details/:email',
                element: <HRRouter><EmployeeDetails></EmployeeDetails></HRRouter>,
            },
            {
                path: '/dashboard/progress',
                element: <HRRouter><Progress></Progress></HRRouter>,
            },
            {
                path: '/dashboard/all-employee-list',
                element: <AdminRouter><AllEmployeeList></AllEmployeeList></AdminRouter>,
            },
            {
                path: '/dashboard/messages',
                element: <AdminRouter><Messages></Messages></AdminRouter>,
            },

        ]
    },
])

export default Router;
