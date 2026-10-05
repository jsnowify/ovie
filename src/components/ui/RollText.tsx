const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";

type Props = {
  children: string; // plain text only, it gets split per character
  /** Delay between characters, in ms */
  stagger?: number;
  /** Draws a line under the text on hover (in from the left, out to the right) */
  underline?: boolean;
  className?: string;
};

/**
 * Each character rolls up and is replaced by a copy from below.
 * The parent must have the `group/roll` class. It triggers on hover and
 * on keyboard focus. Nothing moves in layout, only the characters roll inside it.
 */
export default function RollText({
  children,
  stagger = 20,
  underline = false,
  className = "leading-[1.2]",
}: Props) {
  const chars = Array.from(children);

  return (
    <>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className={`relative inline-flex ${className}`}>
        {chars.map((char, i) => {
          const c = char === " " ? "\u00A0" : char;
          const style = { transitionDelay: `${i * stagger}ms` };
          return (
            // overflow-y-clip keeps tight letter-spacing from clipping glyph edges
            <span key={i} className="relative inline-block overflow-y-clip">
              <span
                className={`block transition-transform duration-500 ${EASE} group-hover/roll:-translate-y-full group-focus-visible/roll:-translate-y-full motion-reduce:transition-none`}
                style={style}
              >
                {c}
              </span>
              <span
                className={`absolute left-0 top-0 block translate-y-full transition-transform duration-500 ${EASE} group-hover/roll:translate-y-0 group-focus-visible/roll:translate-y-0 motion-reduce:transition-none`}
                style={style}
              >
                {c}
              </span>
            </span>
          );
        })}

        {underline && (
          <span
            className={`absolute inset-x-0 bottom-0 block h-[2px] origin-right scale-x-0 bg-cream transition-transform duration-500 ${EASE} group-hover/roll:origin-left group-hover/roll:scale-x-100 group-focus-visible/roll:origin-left group-focus-visible/roll:scale-x-100 motion-reduce:transition-none`}
          />
        )}
      </span>
    </>
  );
}
