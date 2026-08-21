# Cinematic Building Animation - Design Codex

## Overview

This document defines the scroll-driven cinematic building animation system. Buildings scale dynamically throughout the page scroll, synchronized with camera movement, position, and rotation to create an immersive architectural journey.

---

## Core Principle

**SCROLL → CAMERA MOVEMENT + BUILDING SCALE + POSITION + ROTATION**

NOT simply: `SCROLL → BUILDING SCALE`

The building scale must be part of a complete camera journey that creates a physically believable 3D architectural experience.

---

## Building Scale Timeline

### Building 01 Journey (0% - 85% Scroll)

#### **0% Scroll - Initial State**
- Building is **small and far away**
- Full environment visible
- Camera positioned at distance (Z: 1500)
- Opacity: 60%
- Scale: 0.3x
- TranslateZ: +2000px (deep in space)

#### **20% Scroll - Approach Begins**
- Building gradually **scales up** as camera approaches
- Surrounding environment becomes smaller in comparison
- Opacity: 80%
- Scale: 0.6x
- TranslateZ: +1200px
- Camera slowly rotating around building (8° rotation-Y)

#### **40% Scroll - Filling the Frame**
- Building **fills most of the screen**
- Camera starts **orbiting** building perimeter
- Facade details become visible
- Opacity: 100%
- Scale: 1.2x
- TranslateZ: +400px
- Orbital rotation increasing (15° rotation-Y)

#### **55% Scroll - Maximum Hero Scale**
- Building reaches **dominant visual scale**
- Architectural elements subtly separate and reveal
- Camera closest to building (Z: -200)
- **Foreground architectural effects activate** (balconies, facades pass through viewport)
- Opacity: 100%
- Scale: 1.8x (maximum)
- TranslateZ: -200px (negative = ahead of camera)
- Maximum orbital rotation (20° rotation-Y)

#### **65% Scroll - Pull Away Begins**
- Building starts **scaling down gradually**
- Camera begins pulling away
- Opacity: 90%
- Scale: 1.2x
- TranslateZ: +400px

#### **75% Scroll - Transition to Building 02**
- Building 01 becomes smaller in the distance
- Building 02 starts **scaling up** in the distance
- Both buildings visible in same frame
- Opacity: 60%
- Scale: 0.6x
- TranslateZ: +1200px

#### **85% Scroll - Background**
- Building 01 fades to background
- Opacity: 30%
- Scale: 0.2x
- TranslateZ: +2500px

---

### Building 02 Journey (75% - 100% Scroll)

#### **75% Scroll - Introduction**
- Building 02 appears in distance
- Scale: 0.4x
- TranslateZ: +2200px
- Opacity: 50%
- Rotation-Y: -10° (approaching from opposite angle)

#### **85% Scroll - Approach**
- Scale: 0.8x
- TranslateZ: +1000px
- Opacity: 85%
- Rotation-Y: -5°

#### **90% Scroll - Fill Frame**
- Scale: 1.5x
- TranslateZ: +200px
- Opacity: 100%
- Rotation-Y: 10°

#### **100% Scroll - Hero State**
- Building 02 becomes new hero
- Scale: 2x
- TranslateZ: -300px
- Opacity: 100%
- Rotation-Y: 25° (full orbit)

---

## Camera Movement

### Orbital Movement (40% - 55% Scroll)

During the hero scale phase, the camera **orbits around** the building:

```
Camera Position:
  X: sin(orbitProgress * π * 0.3) * 300px
  Y: 0 (stable)
  Z: 1500 - (scrollProgress * 1700) = -200px at peak
  
Rotation:
  Y: orbitProgress * π * 0.3 = ~30° maximum
  X: sin(scrollProgress * π) * 3° (subtle tilt)
```

### Z-Depth (Zoom) Synchronization

```
Camera Z Position = 1500 - (scrollProgress * 1700)

Progress: 0% → Z: 1500 (far)
Progress: 50% → Z: 650 (mid)
Progress: 100% → Z: -200 (very close)
```

---

## Foreground Architectural Effects

### What: Architecture Passing Through Foreground

As buildings scale to hero size (55% - 70% scroll), architectural elements (balconies, facade details) visually pass through the **foreground** of the viewport.

### Why

Creates immersion that camera is **traveling inside** the architectural space, not just viewing it.

### How

1. **Foreground overlay element** activates at 55% scroll
2. **Gradient mask** simulates balcony/facade edges:
   - Left edge: dark shadow (90deg edge)
   - Center: transparent
   - Right edge: dark shadow (90deg edge)
3. **Opacity animation:**
   - 55% scroll: opacity 0
   - 62% scroll: opacity 60% (peak shadow)
   - 70% scroll: opacity 0
4. **Box-shadow enhancement:**
   - Inset shadows top and bottom (simulate depth)
   - Creates sense of being surrounded by architecture

---

## Easing & Interpolation

### Easing Function: EaseInOutCubic

```javascript
easeInOutCubic(t) {
  return t < 0.5 
    ? 4 * t * t * t 
    : 1 + (-2 * Math.pow(2 * t - 2, 3)) / 2
}
```

**Why:** Smooth ease provides natural acceleration/deceleration, not abrupt snapping.

### Keyframe Interpolation

All properties interpolate between keyframes using easing:

```
before: { scale: 0.3, translateZ: 2000, rotationY: 0, opacity: 0.6 }
after:  { scale: 0.6, translateZ: 1200, rotationY: 8, opacity: 0.8 }
progress: 0.5 → eased value halfway between before/after
```

---

## Technical Implementation

### CSS 3D Transforms

```css
transform: 
  perspective(1200px)
  translateZ(${animation.translateZ}px)
  scale(${animation.scale})
  rotateY(${animation.rotationY}deg)
  rotateX(${Math.sin(scrollProgress * π) * 3}deg)
```

### JavaScript Controller: CinematicBuildingController

**Responsibilities:**
1. Listen to scroll events (passive)
2. Calculate scroll progress (0 - 1.0)
3. Interpolate building keyframes
4. Update building transform properties
5. Update camera position
6. Manage foreground architectural effects

**Key Methods:**
- `interpolateKeyframes()` — lerp between keyframes with easing
- `updateBuildingTransform()` — apply CSS transforms
- `updateCameraPosition()` — orbital movement during hero phase
- `updateArchitectureInForeground()` — fade in/out foreground overlay

---

## Performance Considerations

### will-change: transform, opacity
```css
.building-hero {
  will-change: transform, opacity;
}
```

Tells browser to prepare GPU acceleration for these properties.

### Passive Scroll Listener
```javascript
window.addEventListener('scroll', handler, { passive: true })
```

Improves scroll performance by not blocking on scroll handler.

### Requestable Animations

Currently using scroll-driven transforms (no requestAnimationFrame). For higher performance on lower-end devices:
- Consider RAF-based timeline (if needed)
- Throttle scroll events to 60fps updates

---

## Customization Guide

### Adjusting Building Scale Timeline

Edit `CinematicBuildingController.initializeBuildings()`:

```javascript
keyframes: {
  0: { scale: 0.3, translateZ: 2000, rotationY: 0, opacity: 0.6 },
  // ^ Adjust scroll % and values
}
```

### Changing Camera Orbit Sensitivity

Edit `updateCameraPosition()`:

```javascript
this.camera.position.x = Math.sin(orbitProgress * Math.PI * 0.3) * 300;
//                                                            ^^^  ^^^
//                                        Adjust angle and radius
```

### Modifying Foreground Effect Intensity

Edit `updateArchitectureInForeground()`:

```javascript
const fgStart = 0.55; // Start at 55% scroll
const fgEnd = 0.7;    // End at 70% scroll
foregroundElement.style.opacity = fgProgress * 0.6; // Max 60%
```

---

## Testing Checklist

- [ ] Scroll through full page; buildings scale smoothly
- [ ] At 55% scroll, building reaches maximum scale
- [ ] Camera orbits building during 40-55% scroll range
- [ ] At 55-70% scroll, foreground shadows visible (immersion effect)
- [ ] Building 02 appears and scales as Building 01 fades
- [ ] No jank or dropped frames during scroll
- [ ] Mobile: effects degrade gracefully or disable on low-end devices
- [ ] Perspective and 3D effects render correctly in all browsers

---

## Future Enhancements

1. **Parallax Depth:** Add depth-based parallax for surrounding environment
2. **Lighting Model:** Simulate directional lighting that changes with camera angle
3. **Detail Reveal:** Architectural details (texture, patterns) reveal as scale increases
4. **Interaction:** Click building to lock camera, explore architecture interactively
5. **Animation Performance:** Implement RequestAnimationFrame timeline for 120fps capable devices
6. **Mobile Optimization:** Simplified animations on touch devices, option to disable 3D effects

---

## References

- **Scroll Progress Calculation:** `window.scrollY / (documentHeight - windowHeight)`
- **3D Transform Reference:** MDN CSS Transforms
- **Performance:** Will-change, passive listeners, requestAnimationFrame alternatives
