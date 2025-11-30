# Metro Bundler Error Prevention

## If you see "Cannot read property 'prefix' of null" error:

### Quick Fix:
```bash
# Clear all caches
Remove-Item -Recurse -Force .expo
Remove-Item -Recurse -Force node_modules/.cache

# Restart Metro
npx expo start --clear
```

### If problem persists:
```bash
# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Clear cache and restart
npx expo start --clear
```

## Metro Config
The `metro.config.js` has been configured to:
- Support `.cjs` files (required by ZegoCloud SDK)
- Properly extend Expo's default config
- Handle all transformer and resolver properties safely

## Babel Config
The `babel.config.js` uses `babel-preset-expo` which is the standard for Expo projects.

## Security
Run `npm audit fix` regularly to fix vulnerabilities automatically.

## Cache Management
Clear caches if you experience:
- Bundle errors
- Module not found errors
- Stale code issues
- Metro bundler crashes

Commands:
```bash
npx expo start --clear              # Clear Metro cache
npx expo start -c                    # Same as above (shorthand)
Remove-Item -Recurse -Force .expo    # Clear Expo cache manually
```
