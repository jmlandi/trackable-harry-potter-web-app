/*
  Analytics library using Amplitude for tracking purpose
*/

import amplitude from "./amplitude";

interface EventProps {
  [key: string]: string | number | boolean | Date;
}

export async function trackEvent(eventName: string, eventProps?: EventProps) {
  if (!eventProps?.timestamp)
    eventProps = { ...eventProps, timestamp: new Date() };
  return amplitude.track(eventName, eventProps);
}

