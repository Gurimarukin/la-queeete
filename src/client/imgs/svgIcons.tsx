import React from 'react'

type SVGIcon = (props: { readonly className?: string }) => JSX.Element

export const AddOutline: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
      d="M256 112v288M400 256H112"
    />
  </svg>
)

export const AppsSharp: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <rect x="48" y="48" width="112" height="112" rx="8" ry="8" />
    <rect x="200" y="48" width="112" height="112" rx="8" ry="8" />
    <rect x="352" y="48" width="112" height="112" rx="8" ry="8" />
    <rect x="48" y="200" width="112" height="112" rx="8" ry="8" />
    <rect x="200" y="200" width="112" height="112" rx="8" ry="8" />
    <rect x="352" y="200" width="112" height="112" rx="8" ry="8" />
    <rect x="48" y="352" width="112" height="112" rx="8" ry="8" />
    <rect x="200" y="352" width="112" height="112" rx="8" ry="8" />
    <rect x="352" y="352" width="112" height="112" rx="8" ry="8" />
  </svg>
)

export const ArrowRedoFilled: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path d="M58.79 439.13A16 16 0 0148 424c0-73.1 14.68-131.56 43.65-173.77 35-51 90.21-78.46 164.35-81.87V88a16 16 0 0127.05-11.57l176 168a16 16 0 010 23.14l-176 168A16 16 0 01256 424v-79.77c-45 1.36-79 8.65-106.07 22.64-29.25 15.12-50.46 37.71-73.32 67a16 16 0 01-17.82 5.28z" />
  </svg>
)

export const CaretDownOutline: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path d="M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z" />
  </svg>
)

export const CaretUpOutline: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path d="M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z" />
  </svg>
)

export const CheckMarkSharp: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <title>Checkmark</title>
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeMiterlimit="10"
      strokeWidth="44"
      d="M416 128L192 384l-96-96"
    />
  </svg>
)

export const CloseFilled: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" />
  </svg>
)

export const DiamonFilled: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path d="M121.72 32a4 4 0 00-3.72 5.56l2.3 5.43 40.7 94.9a4 4 0 006.88.82L243 38.4a4 4 0 00-3.2-6.4zM419.93 58.06l-41.28 96.37a4 4 0 003.68 5.57h101a4 4 0 003.4-6.11L427 57.53a4 4 0 00-7.07.53zM85 57.57l-59.71 96.32a4 4 0 003.4 6.11h101a4 4 0 003.67-5.58L92 58.1a4 4 0 00-7-.53zM393.27 32H267.82a1.94 1.94 0 00-1.56 3.11l79.92 106.46a1.94 1.94 0 003.34-.4L391.6 43l3.4-8.34a1.92 1.92 0 00-1.7-2.66zM239 448l-89.43-253.49A3.78 3.78 0 00146 192H25.7a3.72 3.72 0 00-2.95 6l216 279.81a5.06 5.06 0 006.39 1.37 5 5 0 002.39-6.08zM486.3 192H366a3.75 3.75 0 00-3.54 2.51l-98.2 278.16a5.21 5.21 0 002.42 6.31 5.22 5.22 0 006.61-1.39L489.25 198a3.72 3.72 0 00-2.95-6zM259.2 78.93l56 74.67a4 4 0 01-3.2 6.4H200a4 4 0 01-3.2-6.4l56-74.67a4 4 0 016.4 0zm-7 310.31l-67.7-191.91a4 4 0 013.77-5.33h135.46a4 4 0 013.77 5.33l-67.73 191.91a4 4 0 01-7.54 0z" />
  </svg>
)

export const HammerOutline: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <title>Hammer</title>
    <path
      d="M277.42 247a24.68 24.68 0 00-4.08-5.47L255 223.44a21.63 21.63 0 00-6.56-4.57 20.93 20.93 0 00-23.28 4.27c-6.36 6.26-18 17.68-39 38.43C146 301.3 71.43 367.89 37.71 396.29a16 16 0 00-1.09 23.54l39 39.43a16.13 16.13 0 0023.67-.89c29.24-34.37 96.3-109 136-148.23 20.39-20.06 31.82-31.58 38.29-37.94a21.76 21.76 0 003.84-25.2zM478.43 201l-34.31-34a5.44 5.44 0 00-4-1.59 5.59 5.59 0 00-4 1.59h0a11.41 11.41 0 01-9.55 3.27c-4.48-.49-9.25-1.88-12.33-4.86-7-6.86 1.09-20.36-5.07-29a242.88 242.88 0 00-23.08-26.72c-7.06-7-34.81-33.47-81.55-52.53a123.79 123.79 0 00-47-9.24c-26.35 0-46.61 11.76-54 18.51-5.88 5.32-12 13.77-12 13.77a91.29 91.29 0 0110.81-3.2 79.53 79.53 0 0123.28-1.49C241.19 76.8 259.94 84.1 270 92c16.21 13 23.18 30.39 24.27 52.83.8 16.69-15.23 37.76-30.44 54.94a7.85 7.85 0 00.4 10.83l21.24 21.23a8 8 0 0011.14.1c13.93-13.51 31.09-28.47 40.82-34.46s17.58-7.68 21.35-8.09a35.71 35.71 0 0121.3 4.62 13.65 13.65 0 013.08 2.38c6.46 6.56 6.07 17.28-.5 23.74l-2 1.89a5.5 5.5 0 000 7.84l34.31 34a5.5 5.5 0 004 1.58 5.65 5.65 0 004-1.58L478.43 209a5.82 5.82 0 000-8z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
  </svg>
)

export const InformationCircleOutline: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path
      d="M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184 184-82.39 184-184S349.61 64 248 64z"
      fill="none"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeWidth="32"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
      d="M220 220h32v116"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="32"
      d="M208 340h88"
    />
    <path d="M248 130a26 26 0 1026 26 26 26 0 00-26-26z" />
  </svg>
)

export const LogoDiscord: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path d="M464 66.52A50 50 0 00414.12 17L97.64 16A49.65 49.65 0 0048 65.52V392c0 27.3 22.28 48 49.64 48H368l-13-44 109 100zM324.65 329.81s-8.72-10.39-16-19.32C340.39 301.55 352.5 282 352.5 282a139 139 0 01-27.85 14.25 173.31 173.31 0 01-35.11 10.39 170.05 170.05 0 01-62.72-.24 184.45 184.45 0 01-35.59-10.4 141.46 141.46 0 01-17.68-8.21c-.73-.48-1.45-.72-2.18-1.21-.49-.24-.73-.48-1-.48-4.36-2.42-6.78-4.11-6.78-4.11s11.62 19.09 42.38 28.26c-7.27 9.18-16.23 19.81-16.23 19.81-53.51-1.69-73.85-36.47-73.85-36.47 0-77.06 34.87-139.62 34.87-139.62 34.87-25.85 67.8-25.12 67.8-25.12l2.42 2.9c-43.59 12.32-63.44 31.4-63.44 31.4s5.32-2.9 14.28-6.77c25.91-11.35 46.5-14.25 55-15.21a24 24 0 014.12-.49 205.62 205.62 0 0148.91-.48 201.62 201.62 0 0172.89 22.95s-19.13-18.15-60.3-30.45l3.39-3.86s33.17-.73 67.81 25.16c0 0 34.87 62.56 34.87 139.62 0-.28-20.35 34.5-73.86 36.19z" />
    <path d="M212.05 218c-13.8 0-24.7 11.84-24.7 26.57s11.14 26.57 24.7 26.57c13.8 0 24.7-11.83 24.7-26.57.25-14.76-10.9-26.57-24.7-26.57zM300.43 218c-13.8 0-24.7 11.84-24.7 26.57s11.14 26.57 24.7 26.57c13.81 0 24.7-11.83 24.7-26.57S314 218 300.43 218z" />
  </svg>
)

export const NotificationsSharp: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path d="M256 480a80.09 80.09 0 0073.3-48H182.7a80.09 80.09 0 0073.3 48zM400 288v-60.53C400 157 372.64 95.61 304 80l-8-48h-80l-8 48c-68.88 15.61-96 76.76-96 147.47V288l-48 64v48h384v-48z" />
  </svg>
)

export const PersonFilled: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path d="M332.64 64.58C313.18 43.57 286 32 256 32c-30.16 0-57.43 11.5-76.8 32.38-19.58 21.11-29.12 49.8-26.88 80.78C156.76 206.28 203.27 256 256 256s99.16-49.71 103.67-110.82c2.27-30.7-7.33-59.33-27.03-80.6zM432 480H80a31 31 0 01-24.2-11.13c-6.5-7.77-9.12-18.38-7.18-29.11C57.06 392.94 83.4 353.61 124.8 326c36.78-24.51 83.37-38 131.2-38s94.42 13.5 131.2 38c41.4 27.6 67.74 66.93 76.18 113.75 1.94 10.73-.68 21.34-7.18 29.11A31 31 0 01432 480z" />
  </svg>
)

export const RemoveOutline: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
      d="M400 256H112"
    />
  </svg>
)

export const SearchOutline: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path
      d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
      fill="none"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeWidth="32"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="32"
      d="M338.29 338.29L448 448"
    />
  </svg>
)

export const SparklesSharp: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path d="M208 512l-52.38-139.62L16 320l139.62-52.38L208 128l52.38 139.62L400 320l-139.62 52.38zM88 176l-23.57-64.43L0 88l64.43-23.57L88 0l23.57 64.43L176 88l-64.43 23.57zM400 256l-31.11-80.89L288 144l80.89-31.11L400 32l31.11 80.89L512 144l-80.89 31.11z" />
  </svg>
)

export const StarOutline: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path
      d="M480 208H308L256 48l-52 160H32l140 96-54 160 138-100 138 100-54-160z"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="32"
    />
  </svg>
)

export const StarFilled: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path d="M394 480a16 16 0 01-9.39-3L256 383.76 127.39 477a16 16 0 01-24.55-18.08L153 310.35 23 221.2a16 16 0 019-29.2h160.38l48.4-148.95a16 16 0 0130.44 0l48.4 149H480a16 16 0 019.05 29.2L359 310.35l50.13 148.53A16 16 0 01394 480z" />
  </svg>
)

export const StatsChartSharp: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path d="M128 496H48V304h80zM352 496h-80V208h80zM464 496h-80V96h80zM240 496h-80V16h80z" />
  </svg>
)

export const TimeOutline: SVGIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <path
      d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z"
      fill="none"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeWidth="32"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
      d="M256 128v144h96"
    />
  </svg>
)
