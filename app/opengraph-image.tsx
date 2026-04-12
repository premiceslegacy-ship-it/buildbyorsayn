import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'BUILD - Le système complet pour construire et vendre dans le business IA.'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// All SVG coordinates are pre-calculated (no transforms) for Satori compatibility.
// Original coords scaled by 2.5x, then centered in a 500x400 canvas.
// Original bounding box: x[25..475]=450w, y[91..450]=359h
// Centering offset: x+12.5 (to center 450w in 500w), y+5 (slight top padding)
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0e0e0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
          {/* Flat SVG - Zero transforms, all coords pre-baked at 2.5x scale */}
          <svg
            width="500"
            height="380"
            viewBox="0 0 500 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Group 1: original translate(0,55), scale 2.5 → shift all y by +55, then ×2.5 */}
            {/* Top face */}
            <path fill="#e8d5b0" d="M137.5 200 L262.5 137.5 L387.5 200 L262.5 262.5 Z" />
            {/* Left face */}
            <path fill="#30261c" d="M137.5 200 L262.5 262.5 L262.5 412.5 L137.5 350 Z" />
            {/* Right face */}
            <path fill="#c9b48a" d="M387.5 200 L262.5 262.5 L262.5 412.5 L387.5 350 Z" />

            {/* Group 2: original translate(10,80), scale 2.5 → (x+10)*2.5, (y+80)*2.5 */}
            {/* Top face */}
            <path fill="#e8d5b0" d="M25 262.5 L137.5 206.25 L250 262.5 L137.5 318.75 Z" />
            {/* Left face */}
            <path fill="#30261c" d="M25 262.5 L137.5 318.75 L137.5 450 L25 393.75 Z" />
            {/* Right face */}
            <path fill="#c9b48a" d="M250 262.5 L137.5 318.75 L137.5 450 L250 393.75 Z" />

            {/* Group 3: original translate(55,57), scale 2.5 */}
            {/* Top face */}
            <path fill="#e8d5b0" d="M137.5 205 L250 148.75 L362.5 205 L250 261.25 Z" />
            {/* Left face */}
            <path fill="#30261c" d="M137.5 205 L250 261.25 L250 392.5 L137.5 336.25 Z" />
            {/* Right face */}
            <path fill="#c9b48a" d="M362.5 205 L250 261.25 L250 392.5 L362.5 336.25 Z" />

            {/* Group 4: original translate(100,34), scale 2.5 */}
            {/* Top face */}
            <path fill="#e8d5b0" d="M250 147.5 L362.5 91.25 L475 147.5 L362.5 203.75 Z" />
            {/* Left face */}
            <path fill="#30261c" d="M250 147.5 L362.5 203.75 L362.5 335 L250 278.75 Z" />
            {/* Right face */}
            <path fill="#c9b48a" d="M475 147.5 L362.5 203.75 L362.5 335 L475 278.75 Z" />
          </svg>

          <div
            style={{
              display: 'flex',
              fontSize: '120px',
              fontWeight: 800,
              color: '#f0ede8',
              letterSpacing: '28px',
              textTransform: 'uppercase',
            }}
          >
            BUILD
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
