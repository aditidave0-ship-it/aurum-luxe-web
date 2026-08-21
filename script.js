// ============================================================================
// CINEMATIC BUILDING ANIMATION - Scroll-Driven Camera Journey
// ============================================================================
// Building scale is synchronized with camera movement, position, and rotation
// to create an immersive architectural experience.
// ============================================================================

const header = document.querySelector(".site-header");
const year = document.querySelector("#year");

// ============================================================================
// SCROLL-DRIVEN BUILDING ANIMATION
// ============================================================================

class CinematicBuildingController {
  constructor() {
    this.scrollProgress = 0;
    this.buildings = this.initializeBuildings();
    this.camera = this.initializeCamera();
    this.init();
  }

  initializeBuildings() {
    return {
      building01: {
        element: document.querySelector('[data-building="01"]') || this.createBuildingElement('01'),
        keyframes: {
          0: { scale: 0.3, translateZ: 2000, rotationY: 0, opacity: 0.6 },
          20: { scale: 0.6, translateZ: 1200, rotationY: 8, opacity: 0.8 },
          40: { scale: 1.2, translateZ: 400, rotationY: 15, opacity: 1 },
          55: { scale: 1.8, translateZ: -200, rotationY: 20, opacity: 1 },
          65: { scale: 1.2, translateZ: 400, rotationY: 15, opacity: 0.9 },
          75: { scale: 0.6, translateZ: 1200, rotationY: 8, opacity: 0.6 },
          85: { scale: 0.2, translateZ: 2500, rotationY: 0, opacity: 0.3 },
        }
      },
      building02: {
        element: document.querySelector('[data-building="02"]') || this.createBuildingElement('02'),
        keyframes: {
          75: { scale: 0.4, translateZ: 2200, rotationY: -10, opacity: 0.5 },
          85: { scale: 0.8, translateZ: 1000, rotationY: -5, opacity: 0.85 },
          90: { scale: 1.5, translateZ: 200, rotationY: 10, opacity: 1 },
          100: { scale: 2, translateZ: -300, rotationY: 25, opacity: 1 },
        }
      }
    };
  }

  initializeCamera() {
    return {
      fov: 75,
      position: { x: 0, y: 0, z: 1500 },
      rotation: { x: 0, y: 0, z: 0 },
      focal: { x: 0, y: 200, z: 0 }
    };
  }

  createBuildingElement(id) {
    const div = document.createElement('div');
    div.setAttribute('data-building', id);
    div.className = 'building-hero';
    div.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100vh;
      transform: translate(-50%, -50%);
      perspective: 1200px;
      z-index: -1;
      pointer-events: none;
    `;
    document.body.insertBefore(div, document.body.firstChild);
    return div;
  }

  interpolateKeyframes(keyframes, progress) {
    const progressPercent = progress * 100;
    const sortedKeys = Object.keys(keyframes).map(Number).sort((a, b) => a - b);

    let before = sortedKeys[0];
    let after = sortedKeys[sortedKeys.length - 1];

    for (let i = 0; i < sortedKeys.length - 1; i++) {
      if (progressPercent >= sortedKeys[i] && progressPercent <= sortedKeys[i + 1]) {
        before = sortedKeys[i];
        after = sortedKeys[i + 1];
        break;
      }
    }

    const beforeFrame = keyframes[before];
    const afterFrame = keyframes[after];
    const rangeDuration = after - before;
    const rangeProgress = (progressPercent - before) / rangeDuration;
    const easeProgress = this.easeInOutCubic(Math.max(0, Math.min(1, rangeProgress)));

    return {
      scale: beforeFrame.scale + (afterFrame.scale - beforeFrame.scale) * easeProgress,
      translateZ: beforeFrame.translateZ + (afterFrame.translateZ - beforeFrame.translateZ) * easeProgress,
      rotationY: beforeFrame.rotationY + (afterFrame.rotationY - beforeFrame.rotationY) * easeProgress,
      opacity: beforeFrame.opacity + (afterFrame.opacity - beforeFrame.opacity) * easeProgress,
    };
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 + (-2 * Math.pow(2 * t - 2, 3)) / 2;
  }

  updateBuildingTransform(building, animation) {
    const transform = `
      perspective(1200px)
      translateZ(${animation.translateZ}px)
      scale(${animation.scale})
      rotateY(${animation.rotationY}deg)
      rotateX(${Math.sin(this.scrollProgress * Math.PI) * 3}deg)
    `;

    building.element.style.transform = transform;
    building.element.style.opacity = animation.opacity;
  }

  updateCameraPosition() {
    const progress = this.scrollProgress;
    
    // Camera orbits around buildings during hero scale (40-55%)
    const orbitStart = 0.4;
    const orbitEnd = 0.55;
    
    if (progress >= orbitStart && progress <= orbitEnd) {
      const orbitProgress = (progress - orbitStart) / (orbitEnd - orbitStart);
      this.camera.rotation.y = orbitProgress * Math.PI * 0.3;
      this.camera.position.x = Math.sin(orbitProgress * Math.PI * 0.3) * 300;
    } else if (progress < orbitStart) {
      this.camera.rotation.y = 0;
      this.camera.position.x = 0;
    }

    // Camera zoom (Z position) synchronized with scroll
    this.camera.position.z = 1500 - (progress * 1700);
  }

  updateArchitectureInForeground() {
    // Create foreground architectural elements that pass through viewport
    // as buildings scale to hero size (55-70% scroll)
    const fgStart = 0.55;
    const fgEnd = 0.7;

    if (this.scrollProgress >= fgStart && this.scrollProgress <= fgEnd) {
      const fgProgress = (this.scrollProgress - fgStart) / (fgEnd - fgStart);
      
      // Simulate balconies/facades passing through foreground
      let foregroundElement = document.querySelector('[data-foreground="balcony"]');
      
      if (!foregroundElement) {
        foregroundElement = document.createElement('div');
        foregroundElement.setAttribute('data-foreground', 'balcony');
        foregroundElement.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          pointer-events: none;
          z-index: 5;
          background: linear-gradient(
            90deg,
            rgba(25, 23, 19, 0.7) 0%,
            transparent 20%,
            transparent 80%,
            rgba(25, 23, 19, 0.7) 100%
          );
          box-shadow: 
            inset 0 40px 80px rgba(0, 0, 0, 0.3),
            inset 0 -40px 80px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(foregroundElement);
      }

      // Fade in foreground as camera approaches
      foregroundElement.style.opacity = fgProgress * 0.6;
    } else {
      let foregroundElement = document.querySelector('[data-foreground="balcony"]');
      if (foregroundElement) {
        foregroundElement.style.opacity = 0;
      }
    }
  }

  onScroll() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

    // Update building animations
    Object.values(this.buildings).forEach(building => {
      const animation = this.interpolateKeyframes(building.keyframes, this.scrollProgress);
      this.updateBuildingTransform(building, animation);
    });

    // Update camera position
    this.updateCameraPosition();

    // Update foreground architectural elements
    this.updateArchitectureInForeground();

    // Update header state
    header.classList.toggle("scrolled", window.scrollY > 24);
  }

  init() {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll(); // Initial call
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

year.textContent = new Date().getFullYear();

// Initialize cinematic building controller only if scroll height is sufficient
window.addEventListener('load', () => {
  if (document.documentElement.scrollHeight > window.innerHeight * 2) {
    new CinematicBuildingController();
  }
});

// Fallback for older header update
const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};
window.addEventListener("scroll", updateHeader, { passive: true });
