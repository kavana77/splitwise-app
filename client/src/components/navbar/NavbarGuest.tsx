import { useState } from "react";
import Logo from "../../assets/images.png";
import DarkModeToggle from "../DarkModeToggle";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import UserAuthForm from "@/pages/userAuthForm";
const NavbarGuest = () => {
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

  return (
    <nav className= {`relative h-1 flex justify-between px-12 lg:px-38 pt-6 lg:pt-16 ${isDark ? 'text-white': 'text-black'}`} >
      <div className="flex gap-2 items-center ">
        <img src={Logo} className="w-10 lg:w-15" />
        <h1 className="font-bold text-xl lg:text-3xl">Splitwise</h1>
      </div>

      <div className="flex gap-4 lg:gap-6 items-center">
        <Dialog>
          <DialogTrigger className="space-x-6">
            <button className="bg-emerald-600 px-4 py-2 mr-4 rounded-lg lg:text-xl hover:opacity-80 hover:scale-105 hover:shadow-xl shadow-black/10 transition-all duration-300">
              Get started
            </button>
          </DialogTrigger>
          <DialogContent>
            <UserAuthForm />
          </DialogContent>
        </Dialog>
      </div>
      <DarkModeToggle onToggle={setIsDark}/>      
    </nav>
  );
};

export default NavbarGuest;
