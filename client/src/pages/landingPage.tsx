import Features from "../component/Features";
import Footer from "../component/Footer";
import HeroSection from "../component/HeroSection";
import HowItWorks from "../component/HowItWorks";
import NavbarGuest from "../component/navbar/NavbarGuest";

const LandingPage = () => {
    return ( 
        <>
        <NavbarGuest/>
        <HeroSection
        description="Simplify group expenses effortlessly. Our user-friendly app makes bill splitting, expenses tracking, and payment coordination seamless. Gain financial clarity and peace of mind with Splitwise"
        buttonTitle="Open a Splitwise Account"/>
        <HowItWorks/>
        <Features/>
        <Footer/>
        </>
        
     );
}
 
export default LandingPage;