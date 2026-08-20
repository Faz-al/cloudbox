import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

export async function trackEvent(name, params = {}) {
  try {
    await FirebaseAnalytics.logEvent({
      name,
      params,
    });

    console.log(`[Analytics] Event tracked: ${name}`, params);
  } catch (error) {
    // Analytics must never break SafeVault functionality.
    console.warn(`[Analytics] Failed to track ${name}:`, error);
  }
}

export async function trackSignup() {
  return trackEvent('sign_up', {
    method: 'email',
  });
}

export async function trackFirstFileUpload(fileType = 'unknown') {
  return trackEvent('first_file_upload', {
    file_type: fileType,
  });
}