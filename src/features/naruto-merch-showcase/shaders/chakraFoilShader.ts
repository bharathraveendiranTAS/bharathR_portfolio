import * as THREE from 'three';

/**
 * Custom GLSL Shader for Holographic Chakra Foil Sheen.
 * Simulates thin-film optical interference, chromatic dispersion,
 * and view-dependent iridescence over Japanese ninja seal engravings.
 */

export interface ChakraFoilShaderUniforms {
  uTime: { value: number };
  uMouse: { value: THREE.Vector2 };
  uResolution: { value: THREE.Vector2 };
  uChakraColor: { value: THREE.Color };
  uVermilionColor: { value: THREE.Color };
  uGoldColor: { value: THREE.Color };
  uSealType: { value: number }; // 0: Uzumaki Spiral, 1: Hiraishin Formula, 2: Cursed Seal / Tomoe
  uSheenStrength: { value: number };
}

export const chakraFoilVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const chakraFoilFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uChakraColor;
  uniform vec3 uVermilionColor;
  uniform vec3 uGoldColor;
  uniform float uSealType;
  uniform float uSheenStrength;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;

  #define PI 3.14159265359

  // Cosine-based spectral rainbow palette for chromatic diffraction
  vec3 spectralPalette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.33, 0.67);
    return a + b * cos(2.0 * PI * (c * t + d));
  }

  // Procedural Uzumaki Spiral Seal mask
  float uzumakiSpiral(vec2 p) {
    float r = length(p);
    float a = atan(p.y, p.x);
    float spiral = sin(r * 32.0 - a * 3.0);
    float circleMask = smoothstep(0.42, 0.40, r);
    float innerCut = smoothstep(0.04, 0.06, r);
    return smoothstep(0.2, 0.5, spiral) * circleMask * innerCut;
  }

  // Procedural Hiraishin Kunai Formula markings
  float hiraishinFormula(vec2 p) {
    float r = length(p);
    float border = abs(p.x) < 0.38 && abs(p.y) < 0.44 ? 1.0 : 0.0;
    float kanjiBars = sin(p.y * 28.0) * cos(p.x * 24.0);
    float centralSlash = 1.0 - smoothstep(0.01, 0.03, abs(p.x * 1.5 + p.y));
    float crossSlash = 1.0 - smoothstep(0.01, 0.03, abs(p.x - p.y * 1.5));
    float ring = abs(r - 0.25) < 0.02 ? 1.0 : 0.0;
    return clamp(ring + centralSlash * 0.8 + crossSlash * 0.8 + step(0.6, kanjiBars) * 0.4, 0.0, 1.0) * border;
  }

  // Procedural Cursed Seal of Heaven / Tomoe pattern
  float cursedSeal(vec2 p) {
    float r = length(p);
    float centralPoint = smoothstep(0.06, 0.04, r);
    float tomoeTotal = 0.0;
    for(int i = 0; i < 3; i++) {
      float ang = float(i) * (2.0 * PI / 3.0);
      vec2 tp = vec2(
        p.x * cos(ang) - p.y * sin(ang),
        p.x * sin(ang) + p.y * cos(ang)
      ) - vec2(0.18, 0.0);
      float tr = length(tp);
      float circle = smoothstep(0.07, 0.05, tr);
      float tail = smoothstep(0.08, 0.0, length(tp - vec2(0.04, 0.05))) * (1.0 - smoothstep(0.0, 0.12, tp.x));
      tomoeTotal += clamp(circle + tail, 0.0, 1.0);
    }
    float outerRing = abs(r - 0.35) < 0.015 ? 1.0 : 0.0;
    return clamp(centralPoint + tomoeTotal + outerRing, 0.0, 1.0);
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Centered coordinates (-0.5 to 0.5)
    vec2 p = vUv - 0.5;

    // Card boundary bezel mask
    vec2 d = abs(p) - vec2(0.46, 0.46);
    float cardBorder = 1.0 - smoothstep(0.0, 0.02, max(d.x, d.y));

    // Dynamic mouse tilt angle
    vec2 mouseOffset = (uMouse - 0.5) * 1.8;
    
    // Fresnel factor for view-angle grazing radiance
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.5);

    // Compute optical grating diffraction: phase shifted by position and pointer
    float gratingCoord = dot(p, vec2(cos(uTime * 0.4), sin(uTime * 0.4))) * 8.0 
                       + dot(p, mouseOffset) * 4.0
                       + fresnel * 2.0;

    vec3 rainbow = spectralPalette(gratingCoord + uTime * 0.15);

    // Evaluate seal pattern based on seal type uniform
    float sealMask = 0.0;
    if (uSealType < 0.5) {
      sealMask = uzumakiSpiral(p);
    } else if (uSealType < 1.5) {
      sealMask = hiraishinFormula(p);
    } else {
      sealMask = cursedSeal(p);
    }

    // Base card surface: deep ninja obsidian parchment with metallic micro-grain
    vec3 baseSurface = vec3(0.05, 0.07, 0.09);
    
    // Micro texture grain
    float grain = fract(sin(dot(vUv * 120.0, vec2(12.9898, 78.233))) * 43758.5453) * 0.05;
    baseSurface += grain;

    // Engraved seal color: gold foil base with vermilion & chakra cyan highlights
    vec3 sealColor = mix(uGoldColor, uVermilionColor, sin(p.x * 10.0 + uTime) * 0.5 + 0.5);
    sealColor = mix(sealColor, uChakraColor, fresnel * 0.8);

    // Combine base with holographic sheen
    vec3 finalColor = baseSurface;
    
    // Add iridescent chromatic diffraction on seal engravings and edges
    vec3 iridescentSheen = rainbow * (0.8 + 0.5 * fresnel) * uSheenStrength;
    
    // Emphasize the engraved ninja markings with metallic reflection
    finalColor = mix(finalColor, sealColor + iridescentSheen, sealMask * 0.9);

    // Beveled outer metallic gold border
    float borderLine = (abs(p.x) > 0.42 || abs(p.y) > 0.42) ? 1.0 : 0.0;
    vec3 borderColor = mix(uGoldColor, rainbow, fresnel) * 1.2;
    finalColor = mix(finalColor, borderColor, borderLine * cardBorder);

    // Subtle specular highlight from mouse direction
    float spec = pow(max(dot(reflect(-viewDir, normal), vec3(mouseOffset, 1.0)), 0.0), 16.0);
    finalColor += spec * uChakraColor * 0.4;

    // Corner decorative notches
    float cornerNotch = (abs(p.x) > 0.40 && abs(p.y) > 0.40) ? 0.3 : 0.0;
    finalColor += cornerNotch * uVermilionColor;

    gl_FragColor = vec4(finalColor, cardBorder);
  }
`;
