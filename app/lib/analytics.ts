/**
 * ANALYTICS LIBRARY
 * ==================
 * Centralized event tracking abstraction layer using Amplitude.
 * This decouples components from the Amplitude SDK, making it:
 * - Easy to migrate to different analytics platforms
 * - Consistent across the app
 * - Easier to maintain and test
 *
 * Usage:
 * trackEvent("User Action", { prop1: "value", prop2: 123 })
 */

import amplitude from "./amplitude";

/**
 * Type definition for event properties
 * Flexible structure that accepts strings, numbers, booleans, or dates
 */
interface EventProps {
  [key: string]: string | number | boolean | Date;
}

/**
 * Track event in Amplitude
 *
 * @param eventName - Name of the event (e.g., "Contact Form Submitted")
 * @param eventProps - Optional properties attached to the event
 *        - Automatically includes timestamp if not provided
 *        - User ID and session ID attached by Amplitude
 *        - Example: { first_name: "John", email: "john@example.com" }
 *
 * @returns Promise from amplitude.track()
 *
 * Examples:
 * - trackEvent("Contact Modal Opened")
 * - trackEvent("Contact Form Submitted", { email: "user@example.com", message: "..."})
 * - trackEvent("House Details Opened", { house: "Gryffindor", houseId: "1" })
 */
export async function trackEvent(eventName: string, eventProps?: EventProps) {
  // Ensure timestamp is always included for proper sequencing
  if (!eventProps?.timestamp)
    eventProps = { ...eventProps, timestamp: new Date() };

  return amplitude.track(eventName, eventProps);
}

