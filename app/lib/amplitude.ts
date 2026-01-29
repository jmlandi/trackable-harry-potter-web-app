'use client';

import * as amplitude from '@amplitude/unified';

import { AMPLITUDE_API_KEY } from "@/lib/config";

function initAmplitude() {
  if (typeof window !== 'undefined' && AMPLITUDE_API_KEY) {
    amplitude.initAll(AMPLITUDE_API_KEY, {
      "analytics": {
        "autocapture":true
      },"sessionReplay": {
        "sampleRate": 0.05
      }
    });
  }
}

initAmplitude();

export const Amplitude = () => null;
export default amplitude;