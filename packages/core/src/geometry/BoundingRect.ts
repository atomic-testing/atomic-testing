/**
 * An element's axis-aligned bounding box in viewport pixels — `x`/`y` is the
 * top-left corner, matching the shape of `DOMRect`/`getBoundingClientRect()`.
 */
export interface BoundingRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
