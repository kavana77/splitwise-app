import Text from "./ui/text";
import { motion } from "framer-motion";
import LandingImage from "../assets/hero-page.png";
import DarkImage from "../assets/dark-bg.png";
import LightImage from "../assets/hero-bg.jpg";

import NavbarGuest from "./navbar/NavbarGuest";
import { useDarkMode } from "@/hooks/useDarkMode";
import { toast } from "sonner";
import { useEffect } from "react";
type HeroSectionProps = {
  description: string;
};
const HeroSection = ({ description }: HeroSectionProps) => {
  useEffect(() => {
    const showToast = localStorage.getItem("showLoginToast");
    if (showToast === "true") {
      toast.info("You can now login with the same email.", {
        duration: 5000,
      });
      localStorage.removeItem("showLoginToast");
    }
  }, []);
  const isDark = useDarkMode();

  return (
    <section
      className="lg:h-[100vh]"
      style={{
        backgroundImage: `url(${isDark ? DarkImage : LightImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <NavbarGuest />
      </motion.div>
      <div className="flex items-center py-22 gap-22 px-8">
        <motion.div
          className="lg:w-1/2 px-6 "
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <Text variant="heading" className="md:text-6xl">
            Split & Share
            <br /> Expenses with{" "}
            <motion.span
              className="text-emerald-600 inline-block"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              Friends and Family
            </motion.span>
          </Text>
          <Text variant="muted" className="text-xl md:text-2xl my-4">
            {description}
          </Text>
        </motion.div>
        <motion.div
          className="hidden lg:flex"
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.img
            src={LandingImage}
            className="w-120"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
        </motion.div>
      </div>
    </section>
  );
};
export default HeroSection;
