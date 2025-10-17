import AddExpenses from "../assets/add-expenses.png";
import Details from "../assets/details.png";
import OrganizeExpenses from "../assets/oraganize-expenses.png";
import SettleUp from "../assets/pay-friends-back.png";
import TrackBalance from "../assets/track-balance.png";
import BlackBg from "../assets/black-bg.png";
import {motion} from "framer-motion"
import TealBg from "../assets/teal-bg.png";
import Orange from "../assets/orange-bg.png";
import PurpleBg from "../assets/purple-bg.png";
import Text from "./ui/text";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const Preview = [
  {
    bgImg: BlackBg,
    image: TrackBalance,
    title: "Track Balances",
    description: "Keep track of shared expenses balances, and who owes who.",
  },
  {
    bgImg: TealBg,
    image: OrganizeExpenses,
    title: "Organize Expenses",
    description:
      "Split expenses with any group: trips, housemates, friends, and family.",
  },
  {
    bgImg: Orange,
    image: AddExpenses,
    title: "Add expenses easily",
    description: "Quickly add expenses on the go before you forget who paid.",
  },
  {
    bgImg: BlackBg,
    image: SettleUp,
    title: "Pay friends back",
    description:
      "Settle up with friends and record any cash or online payment.",
  },
  {
    bgImg: PurpleBg,
    image: Details,
    title: "Get even more with PRO",
    description:
      "Get even more organized with receipt scanning, charts and graphs, currency conversion, and more!",
  },
];

const HowItWorks = () => {
  return (
    <Carousel className="text-white">
      <CarouselContent>
        {Preview.map((item, index) => (
          <CarouselItem
            key={index}
            className="flex flex-col md:flex-row items-center gap-8 px-6 py-10 justify-center"
            style={{
              backgroundImage: `url(${item.bgImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <motion.div 
            initial={{x:120,opacity:0}}
            whileInView={{ x:0,opacity:1}}
            transition={{duration:0.8, ease: "easeOut"}}
            viewport={{once: false, amount:0.4}}
            className="relative w-[240px] md:w-[320px]">
              <img
                src={item.image}
                alt={item.title}
                className="rounded-[2rem] shadow-2xl shadow-black"
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-6 
                  bg-gradient-to-t from-black/50 to-transparent 
                  backdrop-blur-xs rounded-b-[2rem]"
              />
            </motion.div>
            <motion.div 
            initial={{x:120,opacity:0}}
            whileInView={{ x:0,opacity:1}}
            transition={{duration:0.8, ease: "easeOut"}}
            viewport={{once: false, amount:0.4}}
            className="flex flex-col items-center md:items-start text-center md:text-left max-w-md">
              <Text className="text-2xl font-semibold mt-6 md:mt-0">
                {item.title}
              </Text>
              <p className="mt-4 text-sm md:text-base">{item.description}</p>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Controls */}
      <CarouselPrevious className="left-2 bg-black/50 text-white" />
      <CarouselNext className="right-2 bg-black/50 text-white" />
    </Carousel>
  );
};

export default HowItWorks;
