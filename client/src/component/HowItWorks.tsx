import AddExpenses from "../assets/add-expenses.png";
import Details from "../assets/details.png";
import OrganizeExpenses from "../assets/oraganize-expenses.png";
import SettleUp from "../assets/pay-friends-back.png";
import TrackBalance from "../assets/track-balance.png";
import BlackBg from "../assets/black-bg.png";
import TealBg from "../assets/teal-bg.png";
import Orange from "../assets/orange-bg.png";
import PurpleBg from "../assets/purple-bg.png";
import Text from "./ui/text";

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
];
const HowItWorks = () => {
  return (
    <section className="my-14">
      <div className="grid md:grid-cols-2 text-white">
        {Preview.map((item, index) => (
          <div
            key={index}
            className=" flex flex-col bottom-0 items-center px-16 text-white"
            style={{
              backgroundImage: `url(${item.bgImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Text className="text-xl mt-10">{item.title}</Text>
            <p className="mt-4">{item.description}</p>
            <img src={item.image} className="h-105 w-80 mt-8 bottom-0" />
          </div>
        ))}
      </div>
      <div
        className="background-image:${PurpleBg} text-white md:flex text-center pt-12 lg:pt-26"
        style={{
          backgroundImage: `url(${PurpleBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="space-y-4 px-16 py-10 md:w-1/2">
          <Text className="text-xl">Get even more with PRO</Text>
          <p>
            Get even more organized with receipt scanning, charts and graphs,
            currency conversion, and more!
          </p>
          <button className="border-2 border-gray-300 px-7 py-2 rounded-lg mt-6">
            Sign up
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center items-center">
          <img src={Details} className="h-110 w-85" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
