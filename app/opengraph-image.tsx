import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'BUILD - Le système complet pour construire et vendre dans le business IA.'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', gap: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg 
              width="500" 
              height="400" 
              viewBox="0 0 500 400" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Le logo original fait ~180x145. On le multiplie par 2.5 (-> 450x360) et on le centre */}
              <g transform="translate(25, 20) scale(2.5)">
                <g transform="translate(0, 55)">
                  <path fill="#e8d5b0" d="M50 25 L100 0 L150 25 L100 50 Z"></path>
                  <path fill="#30261c" d="M50 25 L100 50 V110 L50 85 Z"></path>
                  <path fill="#c9b48a" d="M150 25 L100 50 V110 L150 85 Z"></path>
                </g>
                <g transform="translate(10, 80)">
                  <path fill="#e8d5b0" d="M0 25 L45 2.5 L90 25 L45 47.5 Z"></path> 
                  <path fill="#30261c" d="M0 25 L45 47.5 V100 L0 77.5 Z"></path> 
                  <path fill="#c9b48a" d="M90 25 L45 47.5 V100 L90 77.5 Z"></path> 
                </g>
                <g transform="translate(55, 57)">
                  <path fill="#e8d5b0" d="M0 25 L45 2.5 L90 25 L45 47.5 Z"></path>
                  <path fill="#30261c" d="M0 25 L45 47.5 V100 L0 77.5 Z"></path>
                  <path fill="#c9b48a" d="M90 25 L45 47.5 V100 L90 77.5 Z"></path> 
                </g>
                <g transform="translate(100, 34)">
                  <path fill="#e8d5b0" d="M0 25 L45 2.5 L90 25 L45 47.5 Z"></path>
                  <path fill="#30261c" d="M0 25 L45 47.5 V100 L0 77.5 Z"></path>
                  <path fill="#c9b48a" d="M90 25 L45 47.5 V100 L90 77.5 Z"></path>
                </g>
              </g>
            </svg>
          </div>
          
          <div
            style={{
              display: 'flex',
              fontSize: '110px',
              fontWeight: 800,
              color: '#f0ede8',
              letterSpacing: '24px',
              marginTop: '40px',
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
