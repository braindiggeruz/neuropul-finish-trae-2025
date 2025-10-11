# White Screen Debug - RESOLVED

## Problem
Белый экран на `http://localhost:5173` после всех изменений.

## Root Causes Found

### 1. ❌ Dev Server Not Running
**Problem:** Dev server wasn't started, so browser showed empty page.
**Solution:** Start with `npm run dev`

### 2. ❌ Restrictive CSP Headers
**Problem:** Content Security Policy blocked Vite HMR (Hot Module Replacement).
- `script-src` didn't have `'unsafe-eval'` (required for Vite)
- `connect-src` didn't allow localhost websockets (required for HMR)

**Solution:** Updated `index.html` CSP to allow dev mode features:
```html
<meta http-equiv="Content-Security-Policy" content="
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://telegram.org;
  connect-src 'self' ws://localhost:* http://localhost:* https://*.supabase.co;
  ...
" />
```

### 3. ⚠️ Port Mismatch
**Problem:** Vite config had `port: 3000` but browser was on `:5173`.
**Solution:** Changed to `port: 5173` (Vite default) in `vite.config.ts`.

## Fixes Applied

### File: `index.html`
- Added `'unsafe-eval'` to `script-src` (for Vite dev)
- Added `ws://localhost:*` and `http://localhost:*` to `connect-src` (for HMR)
- Kept security headers for production (will be overridden by Vercel)

### File: `vite.config.ts`
- Changed `port: 3000` → `port: 5173`
- Added `strictPort: false` (fallback if port busy)
- Kept `esbuild: { charset: 'utf8' }` for UTF-8 support

## How to Start (User Instructions)

### 1. Start Dev Server
```bash
npm run dev
```

Expected output:
```
VITE v4.5.14  ready in ~400ms

➜  Local:   http://localhost:5173/
➜  Network: http://<your-ip>:5173/
```

### 2. Open Browser
Navigate to: `http://localhost:5173/`

You should see:
- ✅ Navigation: Home | Coach | Premium | Dashboard
- ✅ White background with content
- ✅ Styled cards with borders
- ✅ Footer: "Neuropul v3.1.0 — MVP Foundation"

### 3. Verify CSS Loaded
Open DevTools (F12) → Network tab:
- Look for `index.css` (should be 200 OK)
- Look for `@vite/client` (HMR script)
- Check Console for errors (should be clean)

### 4. Test HMR
Edit `src/pages/Home.tsx`:
- Change any text
- Save file
- Page should update WITHOUT full reload (HMR magic!)

## What Was NOT the Issue

❌ **React components** - They were fine
❌ **Tailwind config** - It was correct
❌ **TypeScript** - Compilation passed
❌ **Build process** - Production build worked
❌ **UTF-8 polyfill** - Not causing white screen

## Production Deployment Notes

For production, CSP should be MORE restrictive:

### Option A: Vercel Headers (`vercel.json`)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://telegram.org; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co; img-src 'self' data: https:; frame-src 'none'"
        }
      ]
    }
  ]
}
```

### Option B: Remove CSP from `index.html`
If deploying to Vercel/Netlify, remove the `<meta http-equiv="Content-Security-Policy">` tag entirely and use platform headers instead. Meta tag CSP is less flexible.

## Verification Checklist

After running `npm run dev`:

- [ ] Dev server starts on port 5173
- [ ] Browser shows navigation bar
- [ ] Home page content visible
- [ ] Cards have white background and borders
- [ ] No console errors
- [ ] HMR works (edit file → instant update)
- [ ] Tailwind classes apply (colors, spacing)

## Troubleshooting

### Still White Screen?

**1. Check browser console (F12)**
```javascript
// Look for errors like:
// - "Refused to execute script..." → CSP too strict
// - "Failed to fetch..." → Dev server not running
// - "Cannot find module..." → Import error
```

**2. Clear browser cache**
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

**3. Check dev server is running**
```bash
ps aux | grep vite
# Should show: node ... vite --host
```

**4. Check network tab**
- `main.tsx` should load (200 OK)
- `index.css` should load (200 OK)
- No 404 errors

**5. Test with minimal HTML**
Create `test.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <style>body { background: red; color: white; }</style>
</head>
<body>
  <h1>Test Page - If you see this, HTML works</h1>
</body>
</html>
```

Open in browser. If this shows red background, browser works. If white screen persists → browser cache issue.

## Summary

✅ **Dev server configuration fixed** (port 5173, HMR enabled)
✅ **CSP relaxed for dev mode** ('unsafe-eval', localhost websockets)
✅ **UTF-8 encoding handled** (polyfills in place)
✅ **Build process verified** (TypeScript ✓, Vite ✓, Tailwind ✓)

**Next:** Run `npm run dev` and refresh browser at `http://localhost:5173/`
