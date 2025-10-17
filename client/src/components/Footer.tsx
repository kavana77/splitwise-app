import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserAuthForm from "@/pages/userAuthForm";
const Footer = () => {
  return (
    <footer className="bg-black text-white ">
      <div className="flex justify-between  md:px-22 py-4 px-6 lg:text-lg">
        <ul>
          <li className="text-emerald-400 font-semibold">SplitWise</li>
          <li>About</li>
        </ul>

        <ul>
          <li className="text-orange-400 font-semibold">Account</li>
          <Dialog>
            <DialogTrigger className="flex flex-col items-start">
              <li className="hover:text-orange-400">Login</li>
              <li className="hover:text-orange-400">Sign up</li>
            </DialogTrigger>
            <DialogContent>
              <UserAuthForm />
            </DialogContent>
          </Dialog>
        </ul>
        <ul>
          <li className="font-semibold text-purple-400 ">More</li>
          <li>Contact us</li>
          <li>FAQ</li>
        </ul>
        <div className="flex flex-col justify-center items-center space-y-4 bg-gray-900 w-30 sm:w-50 rounded-2xl p-4">
          <p>Follow us</p>
          <div className=" flex gap-6">
            <a
              href="https://www.instagram.com/splitwise"
              className="hover:text-purple-400"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/splitwise"
              className="hover:text-purple-400"
            >
              <FaFacebook />
            </a>
            <a href="https://x.com/splitwise" className="hover:text-purple-400">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 91">
        <path fill="#ACE4D6" d="M349 76.499L286 113V40z"></path>
        <path fill="#0C3C32" d="M480 74.5L446 94V55z"></path>
        <path
          fill="#1CC29F"
          d="M223 76.5l63 36.5V40zm182 1.999L446 102V55z"
        ></path>
        <path fill="#137863" d="M169 48v82l71-41z"></path>
        <path fill="#1CC29F" d="M121 75.499L169 103V48z"></path>
        <path fill="#373B3F" d="M456 101h-96V46z"></path>
        <path fill="#52595F" d="M360 46v55h-96z"></path>
        <path fill="#A473DB" d="M436 93h63V57z"></path>
        <path fill="#D0B3EB" d="M499 57v36h63z"></path>
        <path fill="#0C3C32" d="M491 93h84.18V44z"></path>
        <path fill="#1CC29F" d="M575.18 93h84.179l-84.18-49z"></path>
        <path fill="#FF2900" d="M601 94h48V66z"></path>
        <path fill="#FF692C" d="M649 66v28h48z"></path>
        <path fill="#FF815C" d="M170.385 93h76V49z"></path>
        <path fill="#FF2900" d="M246.385 49v44h76z"></path>
        <path fill="#373B3F" d="M166 93H70V38z"></path>
        <path fill="#52595F" d="M70 38v55h-96z"></path>
      </svg>
    </footer>
  );
};

export default Footer;
