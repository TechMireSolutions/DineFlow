/**
 * @file format.js
 * @description Shared utility functions and animation configuration constants
 * used across multiple DineFlow components.
 */

/**
 * Formats a numeric value as a USD currency string with no decimal places.
 * Example: money(48) → "$48"
 *
 * @param {number} value - The amount to format
 * @returns {string} Formatted currency string
 */
export const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

/**
 * Framer Motion animation props for the slide-out Sheet component.
 * Slides in from the right with a spring easing for a natural feel.
 *
 * @type {import("framer-motion").MotionProps}
 */
export const sheetMotion = {
  initial:    { x: 360, opacity: 0 },
  animate:    { x: 0,   opacity: 1 },
  exit:       { x: 360, opacity: 0 },
  transition: { type: "spring", stiffness: 240, damping: 28 },
};
