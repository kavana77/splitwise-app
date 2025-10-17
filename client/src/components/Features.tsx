import { Card, CardContent } from "./ui/card";
import {  motion } from "framer-motion";
import Text from "./ui/text";
import BG from "../assets/background-noise.webp";
import BlackBG from "../assets/black-bg-noise.png";
import { Wallet, Users, Smartphone } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";

const features = [
  {
    icon: <Wallet className="h-10 w-10 text-teal-600" />,
    title: "Track Expenses",
    description:
      "Easily track and manage shared expenses with friends and family.",
  },
  {
    icon: <Users className="h-10 w-10 text-blue-600" />,
    title: "Split Bills",
    description: "Automatically split bills and expenses among group members.",
  },
  {
    icon: <Smartphone className="h-10 w-10 text-teal-600" />,
    title: "Access Anywhere",
    description: "Use our app seamlessly across on mobile and desktop devices.",
  },
];

const Features = () => {
  const isDark = useDarkMode();
  return (
    <section
      style={{ backgroundImage: `url(${isDark ? BlackBG : BG})` }}
      className="bg-cover bg-center"
    >
      <div className="text-center space-y-4 p-14 lg:px-34 relative">
        <motion.div initial={{y: 120,opacity:0}}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{duration:1, ease:"easeOut"}}
        viewport={{ once: false, amount: 0.2 }}
        >
          <Text variant="heading">Features</Text>
          <Text variant="muted" className="md:text-lg">
            Everything you need to manage expenses with friends.
          </Text>
        </motion.div>
        <div className="lg:grid lg:grid-cols-2 gap-20 mt-10 relative">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: index * 0.1,
              }}
              viewport={{ once: false, amount: 0.2 }}
              className={`relative flex justify-center ${
                index === 2 ? "col-span-2" : ""
              }`}
            >
              <Card className="w-full md:w-80 shadow-lg">
                <CardContent className="flex flex-col items-center space-y-2 lg:px-6 py-6">
                  {feature.icon}
                  <Text className="font-semibold">{feature.title}</Text>
                  <Text variant="muted" className="text-sm">
                    {feature.description}
                  </Text>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
