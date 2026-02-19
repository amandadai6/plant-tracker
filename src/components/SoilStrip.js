import React, { useMemo } from 'react';
import { View } from 'react-native';

const SOIL_COLOR = '#8B5840';
const TUFT_HEIGHTS = [2, 3, 2, 4, 2, 3, 3, 2, 4, 3];
const TUFT_SPACING = 4;
const TUFT_HALF_W = 1;
// Expand the container by this much on every side so no tuft tip is clipped.
// Must be >= max(TUFT_HEIGHTS).
const PAD = 4;

// Tuft positions are computed in pill-local coordinates (pill top-left = 0,0).
// For a borderBottom triangle on a 0×0 View, React Native places the apex at
// the element's (left, top) and the base H px "downward." Rotating by −θ° around
// that apex (which IS the layout-center for a 0×0 element) swings the base from
// "downward" to "inward," leaving the sharp tip pointing outward.
//
// Element placement:
//   left  = px + H·sin(θ)    ← apex H px outward from the circumference point
//   top   = py − H·cos(θ)
//   rotate = −θ°
function buildTufts(width, height) {
  const R = height / 2;
  const tufts = [];
  let idx = 0;

  const nextH = () => TUFT_HEIGHTS[idx++ % TUFT_HEIGHTS.length];

  function addTuft(px, py, thetaDeg) {
    const h = nextH();
    const rad = (thetaDeg * Math.PI) / 180;
    // React Native rotates a 0×0 border element around its visual center
    // (left, top + h/2), not its layout corner. Solving for the element
    // position that places the apex at the outer tip after rotation:
    //   left = px + (h/2)·sin(θ)
    //   top  = py − (h/2)·(1 + cos(θ))
    tufts.push({
      left: px + (h / 2) * Math.sin(rad),
      top:  py - (h / 2) * (1 + Math.cos(rad)),
      h,
      rotateDeg: -thetaDeg,
    });
  }

  // 1. Straight top edge (θ = 0°, apex points up)
  for (let x = R; x <= width - R; x += TUFT_SPACING) {
    addTuft(x, 0, 0);
  }

  // 2. Right cap: θ sweeps 0° → 180°
  const numCap = Math.max(3, Math.floor((Math.PI * R) / TUFT_SPACING));
  const rCx = width - R, rCy = R;
  for (let i = 0; i <= numCap; i++) {
    const θ = (i / numCap) * 180;
    const rad = (θ * Math.PI) / 180;
    addTuft(rCx + R * Math.sin(rad), rCy - R * Math.cos(rad), θ);
  }

  // 3. Straight bottom edge (θ = 180°, apex points down)
  for (let x = width - R; x >= R; x -= TUFT_SPACING) {
    addTuft(x, height, 180);
  }

  // 4. Left cap: θ sweeps 180° → 360°
  const lCx = R, lCy = R;
  for (let i = 0; i <= numCap; i++) {
    const θ = 180 + (i / numCap) * 180;
    const rad = (θ * Math.PI) / 180;
    addTuft(lCx + R * Math.sin(rad), lCy - R * Math.cos(rad), θ);
  }

  return tufts;
}

export default function SoilStrip({ width, height, borderRadius, marginTop }) {
  const tufts = useMemo(() => buildTufts(width, height), [width, height]);

  // The container is PAD px larger on every side so no tuft tip falls outside
  // the layout bounds (avoiding ScrollView clipping). The pill body and every
  // tuft coordinate are shifted by PAD so the pill appears at the same screen
  // position as before.
  return (
    <View
      style={{
        width: width + 2 * PAD,
        height: height + 2 * PAD,
        marginTop: marginTop - PAD,
        marginLeft: -PAD,
        zIndex: 1,
      }}
    >
      {tufts.map((t, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: t.left + PAD,
            top:  t.top  + PAD,
            width: 0,
            height: 0,
            borderLeftWidth:   TUFT_HALF_W,
            borderRightWidth:  TUFT_HALF_W,
            borderBottomWidth: t.h,
            borderLeftColor:   'transparent',
            borderRightColor:  'transparent',
            borderBottomColor: SOIL_COLOR,
            transform: [{ rotate: `${t.rotateDeg}deg` }],
          }}
        />
      ))}

      {/* Pill body — same colour, covers tuft bases, shifted by PAD */}
      <View
        style={{
          position: 'absolute',
          top:  PAD,
          left: PAD,
          width,
          height,
          backgroundColor: SOIL_COLOR,
          borderRadius: borderRadius ?? height / 2,
        }}
      />
    </View>
  );
}
