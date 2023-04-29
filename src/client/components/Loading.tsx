import React from 'react'

import { cssClasses } from '../utils/cssClasses'

type LoadingProps = {
  className?: string
}

export const Loading = ({ className }: LoadingProps): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={cssClasses('animate-spin', className)}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      opacity={0.25}
    />
    <path
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      fill="currentColor"
      opacity={0.75}
    />
  </svg>
)
