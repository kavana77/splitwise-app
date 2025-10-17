import Features from "../components/Features";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";

const LandingPage = () => {
    return ( 
        <>
        <HeroSection
        description="Simplify group expenses effortlessly. Our user-friendly app makes bill splitting, expenses tracking, and payment coordination seamless. Gain financial clarity and peace of mind with Splitwise"
        />
        <HowItWorks/>
        <Features/>
        <Footer/>
        </>
        
     );
}
 
export default LandingPage;