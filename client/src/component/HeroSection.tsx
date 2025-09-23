import Text from "./ui/text";
import LandingImage from '../assets/landing-page.jpg'
type HeroSectionProps = {
    description: string;
    buttonTitle?: string
}
const HeroSection = ({description, buttonTitle}: HeroSectionProps) => {
    return ( 
        <section className="my-24 md:h-[90vh] flex items-center">
            <div className="md:w-1/2 px-6 ">
                <Text variant="heading" className=" md:text-6xl">Split & Share<br/> Expenses with <span className="text-emerald-600">Friends and Family</span></Text>
                <Text variant="muted" className="text-xl md:text-2xl my-4">{description}</Text>
                <button className="bg-black px-4 py-3 text-white">{buttonTitle}</button>
            </div>
            <div className="hidden md:flex w-1/2">
                <img src={LandingImage}/>
            </div>
        </section>
     );
}
export default HeroSection;