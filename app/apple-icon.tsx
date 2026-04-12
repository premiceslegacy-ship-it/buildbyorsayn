import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="180"
        height="180"
        viewBox="-10 20 210 175"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
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
      </svg>
    ),
    {
      ...size,
    }
  )
}
