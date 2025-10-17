import { cn } from "../../lib/utils";
import { cva } from "class-variance-authority";

type TextProps = React.HTMLAttributes<HTMLParagraphElement> & {
  variant?: "heading" | "muted" | "caption";
};
export default function Text({ className, variant, ...props }: TextProps) {
  return <p {...props} className={cn(textVariants({ variant }), className)} />;
}
const textVariants = cva("text-sm", {
  variants: {
    variant: {
      heading: "text-4xl font-bold",
      muted: "text-gray-400 text-[12px]",
      caption: "text-md font-bold",
    },
  },
  defaultVariants: {
    variant: "caption",
  },
});
