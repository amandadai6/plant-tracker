import React, { useMemo } from 'react';
import { View } from 'react-native';

const SOIL_COLOR = '#8B5840'; // warm reddish-brown to match reference
const TUFT_HEIGHTS = [4, 6, 5, 7, 4, 5, 6, 4, 7, 5];
const TUFT_SPACING = 4; // px between tufts along arc
const TUFT_HALF_WIDTH = 1; // each side of the triangle = 1px → 2px base

// Build tuft positions going clockwise around the full pill perimeter.
// Each tuft uses the borderBottom triangle trick with a rotation so the
// apex points outward and the base sits on (and is hidden by) the pill body.
// Formula: tip placed h px outward from the circumference point along angle θ,
// then rotated θ° so the base points inward.
function buildTufts(width, height) {
  const R = height / 2; // cap radius for a pill shape
  const tufts = [];
  let idx = 0;

  function addTuft(px, py, angleDeg) {
    const h = TUFT_HEIGHTS[idx % TUFT_HEIGHTS.length];
    idx++;
    const rad = (angleDeg * Math.PI) / 180;
    tufts.push({
      // Place element so the triangle tip sits h px outward from (px, py)
      left: px + h * Math.sin(rad),
      top: py - h * Math.cos(rad),
      h,
      angleDeg,
    });
  }

  // 1. Straight top edge — tufts point UP (θ = 0°)
  for (let x = R; x <= width - R; x += TUFT_SPACING) {
    addTuft(x, 0, 0);
  }

  // 2. Right cap — θ sweeps 0° → 180° (top-right → right → bottom-right)
  const numCap = Math.max(3, Math.floor((Math.PI * R) / TUFT_SPACING));
  const rCx = width - R;
  const rCy = R;
  for (let i = 0; i <= numCap; i++) {
    const θ = (i / numCap) * 180;
    const rad = (θ * Math.PI) / 180;
    addTuft(rCx + R * Math.sin(rad), rCy - R * Math.cos(rad), θ);
  }

  // 3. Straight bottom edge — tufts point DOWN (θ = 180°), right → left
  for (let x = width - R; x >= R; x -= TUFT_SPACING) {
    addTuft(x, height, 180);
  }

  // 4. Left cap — θ sweeps 180° → 360° (bottom-left → left → top-left)
  const lCx = R;
  const lCy = R;
  for (let i = 0; i <= numCap; i++) {
    const θ = 180 + (i / numCap) * 180;
    const rad = (θ * Math.PI) / 180;
    addTuft(lCx + R * Math.sin(rad), lCy - R * Math.cos(rad), θ);
  }

  return tufts;
}

export default function SoilStrip({ width, height, borderRadius, marginTop }) {
  const tufts = useMemo(() => buildTufts(width, height), [width, height]);

  return (
    <View style={{ width, height, marginTop, zIndex: 1, overflow: 'visible' }}>
      {tufts.map((t, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: t.left,
            top: t.top,
            width: 0,
            height: 0,
            borderLeftWidth: TUFT_HALF_WIDTH,
            borderRightWidth: TUFT_HALF_WIDTH,
            borderBottomWidth: t.h,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: SOIL_COLOR,
            transform: [{ rotate: `${t.angleDeg}deg` }],
          }}
        />
      ))}

      {/* Main pill body — rendered on top so tuft bases are cleanly hidden */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height,
          backgroundColor: SOIL_COLOR,
          borderRadius: borderRadius ?? height / 2,
        }}
      />
    </View>
  );
}
