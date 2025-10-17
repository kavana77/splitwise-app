import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
interface CardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}
const CardComponent = ({ title, action, children }: CardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex justify-between">
        <CardTitle>{title}</CardTitle>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">{children}</div>
      </CardContent>
    </Card>
  );
};

export default CardComponent;
