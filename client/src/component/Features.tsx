import { Card, CardContent } from "./ui/card";
import Text from "./ui/text";
import { Wallet, Users, Smartphone} from "lucide-react";

const features = [
    {
        icon: <Wallet className="h-10 w-10 text-teal-600"/>,
        title: "Track Expenses",
        description: "Easily track and manage shared expenses with friends and family."
    },
    {
        icon: <Users className="h-10 w-10 text-blue-600"/>,
        title: "Split Bills",
        description: "Automatically split bills and expenses among group members."
    },
    {
        icon: <Smartphone className="h-10 w-10 text-teal-600"/>,
        title: "Access Anywhere",
        description: "Use our app seamlessly across on mobile and desktop devices."
    }
]
const Features = () => {
    return ( 
        <section className="my-14  shadow-black/8 shadow-2xl">
            <div className="text-center space-y-4 p-14 lg:px-34">
                <Text variant="heading">Features</Text>
                <Text variant="muted" className="md:text-lg">Everything you need to manage expenses with friends.</Text>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-18 mt-10">
                    {features.map((feature, index) => (
                        <Card key={index} className="">
                            <CardContent className="flex flex-col items-center space-y-1.5 lg:px-12">
                                {feature.icon}
                                <Text className="">{feature.title}</Text>
                                <Text variant="muted">{feature.description}</Text>
                            </CardContent>
                        </Card>
                    ))}
                    
                </div>
            </div>
        </section>
     );
}
 
export default Features;