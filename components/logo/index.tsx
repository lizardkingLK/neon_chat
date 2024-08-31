import React from 'react'

export default function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="75 75 150 150">
      <defs>
        {/* Animation for the wire */}
        <path id="wirePath" d="M0,150 Q75,50 150,150 T300,150" fill="none" stroke="none"/>
        
        {/* Gradient for the wire */}
        <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#32a852" stopOpacity="0"/>
          <stop offset="50%" stopColor="#32a852" stopOpacity="1"/>
          <stop offset="100%" stopColor="#32a852" stopOpacity="0"/>
        </linearGradient>

        {/* Radial gradient for pulsing effect */}
        <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%" fx="80%" fy="80%">
          <stop offset="0%" stopColor="#32a852" stopOpacity="0.7">
            <animate attributeName="stopOpacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#32a852" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Animated wire */}
      <use href="#wirePath" stroke="url(#wireGradient)" strokeWidth="2">
        <animate attributeName="stroke-dasharray" from="0,300" to="300,300" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="stroke-dashoffset" from="0" to="-300" dur="3s" repeatCount="indefinite"/>
      </use>
      
      {/* Pulsing circle behind the logo */}
      <circle cx="150" cy="150" r="60" fill="url(#pulseGradient)">
        <animate attributeName="r" values="55;65;55" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Logo group */}
      <g transform="translate(100, 100)">
        {/* White circular background with neumorphic effect */}
        <circle cx="50" cy="50" r="48" fill="#ffffff" filter="url(#neumorphic)"/>
        
        {/* Black "N" letter */}
        <text x="50" y="70" fontFamily="Arial, sans-serif" fontSize="60" fontWeight="bold" textAnchor="middle" fill="black">
          N
        </text>
      </g>
    </svg>
  )
}