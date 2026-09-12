# Zeco iOS App

A native iOS app (Capacitor shell) wrapping the existing zeco-inc.com Staff Portal —
same logins, same role-based access as the website (Accountant sees Labor Compliance
only, a crew lead sees their jobs, etc.), plus native camera, offline form queueing,
and push notifications.

## What's already built (in this cloud workspace)

- `capacitor.config.ts` — points the app at `https://zeco-inc.com/staff/`. That page
  already redirects a logged-out user to `/login/` (with onboarding/registration
  reachable from there for a brand-new hire with no account yet), and shows the
  same role-scoped Quick Access grid as the website once logged in.
- `ios/` — the generated Xcode project (`ios/App/App.xcworkspace`), with:
  - App icon + launch screen generated from the existing PWA icon set.
  - `Info.plist` permission strings (camera, photo library, location, Face ID) and
    the `remote-notification` background mode.
  - `GoogleService-Info.plist` — the Firebase config prepared in an earlier session,
    wired for push.
  - `AppDelegate.swift` — forwards APNs registration/tokens/incoming pushes to
    Capacitor's PushNotifications plugin.
- Capacitor plugins installed: Camera, Push Notifications, Filesystem, Network,
  Preferences, Splash Screen, Status Bar, App.
- On the WordPress side (already deployed to production, v1.6.0 of the **Zeco Field
  App** plugin):
  - `zeco-native.js` (loads site-wide, no-ops outside the app) already had camera,
    geolocation, Android back-button, and status-bar wiring from an earlier
    session — this pass added **push notification registration**: on app launch it
    asks permission, registers for APNs, and POSTs the token to a new
    `/wp-json/zeco/v1/app/push-token` REST route, which upserts it into a new
    `wp_zeco_push_tokens` table (one row per user+platform).
  - Sending pushes *from* WordPress isn't built yet — this pass only gets tokens on
    file. Next step once the app is in testers' hands: a small "send push" helper
    (e.g. hook into Daily Report rejection, a new Look Ahead posted) using Firebase
    Cloud Messaging's HTTP v1 API with the same `GoogleService-Info.plist` project.

## What still needs a Mac (can't be done from this Linux cloud workspace)

1. Open `ios/App/App.xcodeproj` in Xcode (this project uses Swift Package Manager
   for the Capacitor plugins, not CocoaPods, so there's no `.xcworkspace` to look
   for — the `.xcodeproj` is the one to open).
2. Sign in to Xcode with the Zeco Apple Developer Program account (the "app account"
   Amin said is already active) under Xcode → Settings → Accounts.
3. Set the Team on the App target to Zeco, Inc., and let Xcode auto-manage signing
   (or set up a manual provisioning profile for bundle ID `com.zecoinc.app`).
4. In the Apple Developer portal, enable the **Push Notifications** capability for
   `com.zecoinc.app` and upload an APNs Auth Key (or cert) to the Firebase project
   this `GoogleService-Info.plist` belongs to, so Firebase can actually deliver to
   APNs.
5. Build and run on a real device or simulator to sanity-check: login, Time Cards,
   Daily Reports (camera capture), Look Ahead, Labor Compliance, push permission
   prompt.
6. Create the app record in App Store Connect (bundle ID `com.zecoinc.app`, name
   "Zeco"), fill in the store listing (screenshots, description, privacy — this app
   collects photos/location/push tokens tied to a work account, which needs to be
   disclosed in the App Privacy questionnaire), archive and upload a build, then
   submit either to TestFlight (for the crew to test first — recommended) or
   straight to App Store review.

## Design note — the crew skews older; keep the app dead simple

Per Amin: staff includes 70-year-old crew members, so the app has to stay obvious,
not clever. Since this app is a wrapper around the existing site, the actual UI is
whatever the Staff Portal and Time Cards app already render — the highest-leverage
next step is a pass over that existing UI (not app-specific code) for:
- Bigger tap targets on the Quick Access tiles and the Time Cards/Daily Report wizard
  buttons — thumbs, not precision pointing.
- Larger base font size and higher-contrast text, especially on status pills and
  form labels.
- Fewer choices per screen — the wizard step pattern already used in Time
  Cards/Daily Reports (one thing at a time, big Next/Back buttons) is the right
  shape; extending that same pattern anywhere the Staff Portal still shows a dense
  grid or a small link list would help.
- Confirmation text in plain language after every save ("Saved." is already used in
  a few places — keep that, don't replace it with a toast that disappears too fast
  to read).
This is a separate, smaller follow-up pass on the existing WordPress plugins/theme
once the app itself is in testers' hands — flagging it here so it isn't lost.
