import Link from "next/link";
import RollText from "@/components/ui/RollText";

type Props = Omit<React.ComponentProps<typeof Link>, "children"> & {
  children: string; // plain text only, it gets split per character
};

const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";

export default function Button({ children, className = "", ...props }: Props) {
  return (
    <Link
      {...props}
      data-hover-disabled
      className={`group group/roll relative inline-block overflow-hidden border border-current/20 bg-current/10 px-10 py-4 text-sm font-light uppercase tracking-[-0.02em] backdrop-blur-xl transition-colors duration-500 hover:border-clay hover:text-cream motion-reduce:transition-none md:text-base ${className}`}
    >
      {/* Slider: wipes in from the left on hover, wipes out to the right on leave */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-right scale-x-0 bg-clay transition-transform duration-500 ${EASE} group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none`}
      />
      <span className="relative block">
        <RollText>{children}</RollText>
      </span>
    </Link>
  );
}
