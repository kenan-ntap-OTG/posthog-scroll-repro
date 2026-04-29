# posthog-scroll-repro

Minimal Expo + React Native app that reproduces a scroll stutter on iOS when
PostHog session replay is enabled.

The app renders a long `FlatList` (500 rows) inside a `PostHogProvider` with
`enableSessionReplay: true`. Scroll the list on a real iOS device — the stutter
should be visible while replay is active, and disappear when it isn't.

## Requirements

- Node 20+
- [Bun](https://bun.sh/) (used here, but `npm` / `pnpm` / `yarn` will work too)
- Xcode 16+ with a paired physical iPhone (the issue does not reproduce on the
  iOS Simulator)
- An Apple Developer team set up for code signing

## Install

```bash
bun install
```

## Environment

Create a `.env.local` at the repo root with your PostHog project token:

```bash
EXPO_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# Optional, defaults to https://us.i.posthog.com
# EXPO_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

The token must belong to a project where **Session replay** is enabled in
*Project settings → Session replay → Record user sessions*.

## Run on a physical iOS device

Plug in an iPhone, then:

```bash
bunx expo run:ios --device
```

The first build will compile the native dev client and install it on the
device. Subsequent JS changes can be picked up via Metro fast refresh.

> **Important:** if you change `EXPO_PUBLIC_POSTHOG_KEY` (or any other
> `EXPO_PUBLIC_*` variable), you must **force-quit the app** on the device and
> reopen it — Metro reload alone won't re-init the native PostHog SDK, which
> caches the token from the first `setup()` call.

## Verifying session replay is actually active

The repro only works when iOS session replay is actually running. Tap the
**Check session replay** button at the top of the screen — it calls
`posthog.isSessionReplayActive()` and shows the result:

- **ACTIVE ✓** — the native SDK is recording. The stutter should be visible
  while scrolling.
- **INACTIVE ✗** — the native SDK is *not* recording. The stutter will not
  appear in this state. This usually means one of:
  - the env var isn't being picked up (check the API key in the alert),
  - the app wasn't fully relaunched after fixing config,
  - session recording is disabled at the project level in PostHog.

If you see *INACTIVE*, fix the cause and **force-quit + reopen** the app
before re-checking.

## Pinned versions

This repo deliberately pins the PostHog packages so the repro stays stable:

```json
"posthog-react-native": "4.43.5",
"posthog-react-native-session-replay": "1.5.5"
```
