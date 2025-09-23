import { Outlet } from "react-router-dom";
// import  NavbarGuest from "../component/navbar/NavbarGuest";
// import NavbarUser from "../component/navbar/NavbarUser";
// import { useEffect, useState } from "react";

const RootLayout = () => {
    // const [user, setUser] = useState<string | null>(null);

    // useEffect(()=>{
    //     const storedUser =localStorage.getItem("user")
    //     setUser(storedUser)
    // },[])
    // const user = localStorage.getItem("user")
    return ( 
        <>
        {/* {user? <NavbarUser/> : <NavbarGuest/>} */}
            
            
            <main>
                <Outlet/>
            </main>
        </>
     );
}
 
export default RootLayout;