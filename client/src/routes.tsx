import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import RootLayout from "./layout/rootLayout";
import LandingPage from "./pages/landingPage";
import UserAuthForm from "./pages/userAuthForm";
import  Home from "./pages/homePage";
import GroupPage from "./pages/groupPage";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path="/" element={<RootLayout/>}>
            <Route index element={<LandingPage/>}/>
            <Route path="login" element={<UserAuthForm type="log-in"/>}/>
            <Route path="signup" element={<UserAuthForm type="sign-up"/>}/>
            <Route path="dashboard" element={<Home/>}/>
            <Route path="groups/new" element={<GroupPage/>}/>
            <Route path="*" element={<h1>404 Not Found</h1>}/>
        </Route>
        </>
    )
)
export default router