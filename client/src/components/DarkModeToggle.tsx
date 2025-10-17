import { useEffect, useState } from "react";
import { motion } from "framer-motion";
interface DarkModeToggleProps {
  onToggle?: (isDark: boolean) => void;
}
export default function DarkModeToggle({ onToggle }: DarkModeToggleProps) {
  const [isOn, setIsOn] = useState(()=>localStorage.getItem("theme") === "dark");
  
  useEffect(()=>{
    const root = document.documentElement
    if(isOn){
        root.classList.add("dark")
        localStorage.setItem("theme","dark")
    }else{
        root.classList.remove("dark")
        localStorage.setItem("theme","light")
    }
    if (onToggle) onToggle(isOn);
  },[isOn,onToggle])

  const toggleSwitch = () => setIsOn((prev)=>!prev);

  return (
    <button
      className={`absolute right-0 top-0 lg:top-8 lg:right-10 flex items-center  w-[55px] h-[30px] rounded-full cursor-pointer border-1 border-black ${
        isOn ? "justify-start bg-white" : "justify-end bg-black"
        
      }`}
      onClick={toggleSwitch}
    >
      <motion.div
        className="w-[30px] h-[30px] rounded-full bg-emerald-600"
        layout
        transition={{
          type: "spring",
          duration: 0.5,
          bounce: 0.2,
        }}
      />
    </button>
  );
}