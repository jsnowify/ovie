type Props = {
  open: boolean;
  onClick: () => void;
  className?: string;
};

const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";

export default function MenuButton({ open, onClick, className = "" }: Props) {
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="site-menu"
      data-open={open}
      onClick={onClick}
      className={`group relative h-10 w-10 ${className}`}
    >
      <span
        className={`absolute right-0 top-[calc(50%-4px)] block h-px w-6 bg-cream transition-all duration-500 ${EASE} group-hover:w-8 group-data-[open=true]:top-1/2 group-data-[open=true]:w-8 group-data-[open=true]:rotate-45`}
      />
      <span
        className={`absolute right-0 top-[calc(50%+3px)] block h-px w-8 bg-cream transition-all duration-500 ${EASE} group-hover:w-6 group-data-[open=true]:top-1/2 group-data-[open=true]:w-8 group-data-[open=true]:-rotate-45`}
      />
    </button>
  );
}
