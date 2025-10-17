import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import RootLayout from "./layout/rootLayout";
import LandingPage from "./pages/landingPage";
import GroupPage from "./pages/groupPage";
import Dashboard from "./pages/dashboardPage";
import VerifyEmail from "./components/VerifyEmail";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path="/" element={<RootLayout/>}>
            <Route index element={<LandingPage/>}/>
            <Route path="dashboard" element={<Dashboard/>}/>
            <Route path="dashboard/group/:groupId" element={<Dashboard/>}/>
            <Route path="groups/new" element={<GroupPage/>}/>
            <Route path="verify-email" element={<VerifyEmail/>}/>
            <Route path="*" element={<h1>404 Not Found</h1>}/>
        </Route>
        </>
    )
)
export default router