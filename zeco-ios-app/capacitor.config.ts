import type { CapacitorConfig } from '@capacitor/cli';

// Zeco Field App (iOS) — wraps the live zeco-inc.com portal in a native shell.
// This is NOT a separate app with its own backend: it's the same WordPress site,
// same login, same role-based access (Accountant sees Labor Compliance only, a
// crew lead sees their jobs, etc.) — the native shell just adds camera, offline
// queueing, push notifications, and a real App Store presence on top of it.
//
// server.url points at /app-home/, not /staff/ or the marketing homepage.
// Per Amin (2026-09-12): after seeing a real screenshot of /staff/ at app size,
// the site's marketing header (logo + Home/Services/Projects/About/Safety/Bid
// Room/Careers/Contact) and the black union-signatory/contact topbar were both
// showing — exactly the "website info" he didn't want in the app, and he asked
// for a duplicate page dedicated to the app instead of a CSS trick layered on
// /staff/ itself, so "the header design should not impact the existing
// website." /app-home/ (added to the Zeco Field App plugin, v1.7.0) is that
// dedicated page — but it's not a second hand-maintained copy: it fetches the
// real, live /staff/ page server-side as the same logged-in user and strips
// just those two chrome elements plus the wp-admin toolbar, so every tile,
// role gate (Accountant sees Labor Compliance only, a crew lead sees their
// jobs, etc.), and announcement stays exactly what /staff/ already renders —
// zero duplicated logic, zero drift risk, and /staff/ itself is untouched for
// anyone browsing the site normally. Logged out, it bounces to /login/ same as
// /staff/ does (onboarding/registration for a brand-new hire stays reachable
// from there). allowNavigation is still domain-wide so Time Cards, Daily
// Reports, Look Ahead, Labor Compliance, Training, Company Forms, Fleet, and
// Pay Stubs all open inside the app rather than kicking out to Safari.
const config: CapacitorConfig = {
  appId: 'com.zecoinc.app',
  appName: 'Zeco',
  webDir: 'www',
  server: {
    url: 'https://zeco-inc.com/app-home/',
    // Every host the portal legitimately needs while staying inside the app:
    // the main site (pages, REST API, wp-admin for the Time Cards app screen,
    // wp-content for uploaded photos/assets) and Gravatar for avatar images.
    // Nothing outside this list loads inside the WebView — see AppDelegate.
    allowNavigation: [
      'zeco-inc.com',
      '*.zeco-inc.com',
      'secure.gravatar.com',
    ],
    // Real HTTPS site, not a bundled local copy — cleartext never needed.
    androidScheme: 'https',
    iosScheme: 'https',
  },
  ios: {
    contentInset: 'always',
    // The site is already a fully responsive Staff Portal used on phones and
    // iPads (per the mobile-quick-access work) — no separate app UI needed.
    allowsLinkPreview: false,
    scrollEnabled: true,
    backgroundColor: '#14532d',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#14532d',
      androidSplashResourceName: 'splash',
      showSpinner: true,
      spinnerColor: '#ffffff',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
