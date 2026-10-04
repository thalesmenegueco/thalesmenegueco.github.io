export type CardItem = {
  name: string;
  description: string;
  image: string;
  link?: string;

  /**
   * Whether the card's media should have rounded corners.
   *
   * Set it for **screenshots and other opaque images**, where a radius is what
   * frames the picture. Leave it off for **SVG icons**, which are transparent
   * glyphs sitting on the card's own surface: there the radius has no rectangle
   * to round and instead clips the artwork's corners. The two behave differently
   * enough that this is a per-card decision rather than a style rule.
   */
  roundedImage?: boolean;
};
