import Image from "next/image";
import Link from "next/link";

/**
 * The <Image> only provides the natural size (it stays invisible).
 * What you see is `.logo-fill`: the same SVG used as a mask, filled cream,
 * with a clay fill that rises from bottom to top on hover (see globals.css).
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Ovie home"
      className={`logo relative block ${className}`}
    >
      <Image
        src="/ovie.svg"
        alt="Ovie"
        width={40}
        height={40}
        priority
        className="h-10 w-auto opacity-0"
      />
      <span aria-hidden="true" className="logo-fill absolute inset-0" />
    </Link>
  );
}
