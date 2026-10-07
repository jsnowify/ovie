// Work covers are 3:2 photos cropped into a 130%-height parallax layer.
// Desktop: 50vw × 5/4 × 1.3 × 3/2 ≈ 122vw of source pixels.
// Mobile: 100vw × 3/4 × 1.3 × 3/2 ≈ 147vw of source pixels.
// Using only the card width makes object-cover enlarge a small thumbnail.
export const WORK_COVER_SIZES = "(min-width: 768px) 122vw, 147vw";
