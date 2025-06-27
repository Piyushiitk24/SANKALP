# Demo Mode Configuration

This document explains how to configure the demo mode feature flags for presentations and demos.

## Feature Flags

All demo mode configurations are located in `/constants.ts` under the `DEMO_MODE` object.

### Hide Paid Heart Options

```typescript
export const DEMO_MODE = {
  // When true, hides paid heart refill options (points-based and unlimited subscription)
  // Only shows the "watch video to refill hearts" option
  HIDE_PAID_HEART_OPTIONS: true,
};
```

When `HIDE_PAID_HEART_OPTIONS` is set to `true`:

#### Shop Page (`/shop`)
- **Hidden**: Hearts refill with points option (costs 10 points)
- **Hidden**: Unlimited hearts subscription option (Stripe integration)
- **Shown**: Functional "Watch Video" button that opens the hearts modal with video player
- **Behavior**: Clicking "Watch Video" opens the hearts modal directly with the video ready to play

#### Hearts Modal (when out of hearts)
- **Hidden**: "Get unlimited hearts" / "Sign up for unlimited hearts" button (only in demo mode)
- **Hidden**: Shop redirect for paid options
- **Shown**: Only "Watch a video to refill hearts" option
- **Modified**: Description text focuses only on the free video option
- **Auto-video**: When opened from shop, automatically shows video player ready to start

#### User Experience in Demo Mode
- **From Shop**: Click "Watch Video" → Hearts modal opens with video ready
- **From Lesson (out of hearts)**: Hearts modal opens → Click "Watch a video to refill hearts" → Video shows
- **Video Experience**: Same 30-second `/public/bt.mp4` video in both cases
- **Heart Refill**: After watching 30 seconds, "Refill Hearts" button becomes active

### Usage

**For Demo/Presentation Mode:**
```typescript
HIDE_PAID_HEART_OPTIONS: true
```

**For Production/Full Feature Mode:**
```typescript
HIDE_PAID_HEART_OPTIONS: false
```

## What's Preserved

The feature flag implementation **does not delete** any existing functionality:

- ✅ All Stripe integration code remains intact
- ✅ All payment-related server actions are preserved
- ✅ Database schema and subscription logic unchanged
- ✅ All styling and UI components remain functional
- ✅ Easy to toggle back to full feature mode by changing one boolean

## Files Modified

1. `/constants.ts` - Added `DEMO_MODE` configuration object
2. `/app/(main)/shop/items.tsx` - Conditional rendering with functional video button
3. `/components/modals/hearts-modal.tsx` - Enhanced modal with auto-video and demo mode handling
4. `/store/use-hearts-modal.ts` - Added `openWithVideo` function for direct video access

## Testing

To test both modes:

1. **Demo Mode Testing** (`HIDE_PAID_HEART_OPTIONS: true`):
   - Visit `/shop` - should show functional "Watch Video" button
   - Click "Watch Video" - hearts modal should open with video ready to play
   - Watch video for 30 seconds - "Refill Hearts" button should become active
   - Test from lessons when out of hearts - should work identically

2. **Production Mode Testing** (`HIDE_PAID_HEART_OPTIONS: false`):
   - Visit `/shop` - should show all paid options (points refill + unlimited subscription)
   - Run out of hearts in lessons - modal should show all options including paid ones
   - Verify Stripe integration and points-based refill work as expected

## Deployment Considerations

- **Demo Deployments**: Keep `HIDE_PAID_HEART_OPTIONS: true`
- **Production Deployments**: Set `HIDE_PAID_HEART_OPTIONS: false`
- The flag can be changed without any database migrations or breaking changes
