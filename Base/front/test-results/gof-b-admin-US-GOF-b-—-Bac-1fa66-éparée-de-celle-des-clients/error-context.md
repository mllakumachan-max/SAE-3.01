# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gof-b-admin.spec.js >> US GOF-b — Back-office >> CA — L'authentification des administrateurs est séparée de celle des clients
- Location: tests\gof-b-admin.spec.js:74:3

# Error details

```
Error: expect(locator).not.toBeEmpty() failed

Locator:  locator('#app')
Expected: not empty
Received: empty

Call log:
  - Expect "not toBeEmpty" locator('#app') with timeout 20000ms
  - waiting for locator('#app')
    14 × locator resolved to <div id="app"></div>
       - unexpected value "empty"
  - Target page, context or browser has been closed

```

```
Error: browserContext.close: Test ended.
Browser logs:

<launching> C:\Users\mllak\AppData\Local\ms-playwright\chromium_headless_shell-1248\chrome-headless-shell-win64\chrome-headless-shell.exe --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,BlockOriginHeaderModificationOnRedirect,AvoidCorsURLLoaderRestartOnRedirect,Translate,AutoDeElevate,OptimizationHints,NetworkTimeServiceQuerying,AimEnabled,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --disable-updater-scheduler --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=C:\Users\mllak\AppData\Local\Temp\playwright_chromiumdev_profile-GaEAb3 --remote-debugging-pipe --no-startup-window
<launched> pid=41144
[pid=41144][err] [1022/214514.621:INFO:CONSOLE:935] "[vite] connecting...", source: http://localhost:5174/~ribatet1/SAE-3.01/Base/@vite/client (935)
[pid=41144][err] [1022/214514.652:INFO:CONSOLE:1048] "[vite] connected.", source: http://localhost:5174/~ribatet1/SAE-3.01/Base/@vite/client (1048)
```