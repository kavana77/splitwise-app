import { Link } from "react-router-dom";
import Rabbit from "../assets/rabbit.png";
import BlackRabbit from "../assets/black-bg-rabbit.png"
import Logo from "@/assets/images.png";
import Text from "./ui/text";
import { useDarkMode } from "@/hooks/useDarkMode";

interface WelcomeProps{
    setSkipped: (val:boolean) => void
}

const WelcomeState = ({setSkipped}: WelcomeProps) => {
    const isDark = useDarkMode()
    return ( 
                <div className="p-12 rounded-t-3xl mt-[-16px] ">
          <div className="md:mx-24 flex flex-col md:flex-row justify-center items-center gap-6">
            <img src={isDark? BlackRabbit :Rabbit} className="w-48 hidden md:flex" />
            <div className="text-center">
              <Text
                variant="heading"
                className="flex items-center gap-2 text-3xl md:text-4xl"
              >
                <img src={Logo} className="hidden md:flex w-16 h-16" />
                Welcome to Splitwise
              </Text>
              <div className="text-xl my-8">
                What would you like to do first?
              </div>
              <div className="flex flex-col gap-4">
                <Link
                  to="/groups/new"
                  className="bg-orange-500 border border-orange-600 text-white font-bold py-3 text-xl rounded-md mx-4 hover:bg-orange-600"
                >
                  Add a group trip
                </Link>
                <button
                  onClick={() => setSkipped(true)}
                  className="bg-gradient-to-br from-white via-gray-200 to-gray-300 font-bold py-3 text-xl rounded-md mx-4 border border-gray-300 hover:opacity-70"
                >
                  Skip setup for now
                </button>
              </div>
            </div>
          </div>
        </div>
     );
}
 
export default WelcomeState;