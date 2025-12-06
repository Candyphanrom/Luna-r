import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const CRYPTIC_PHRASES = [
    "OBSERVING",
    "THE OWLS ARE NOT WHAT THEY SEEM",
    "THROUGH THE DARKNESS OF FUTURE PAST",
    "IT IS HAPPENING AGAIN",
    "THE GLOW FADES SLOWLY",
    "WHERE WE'RE FROM, THE BIRDS SING A PRETTY SONG",
    "MEANWHILE",
    "BLUE ROSE",
    "I'LL SEE YOU IN 25 YEARS",
    "COOPER... COOPER...",
    "ELECTRICITY",
    "THE MYSTERY OF LIFE ISN'T A PROBLEM TO SOLVE",
    "FALLING, FALLING",
    "GARMONBOZIA",
    "LODGE CALLING"
]

export const EyeSVG = ({
    progress,
    color,
    main = false,
    mousePos = { x: 0, y: 0 }
}: {
    progress: number,
    color: string,
    main?: boolean,
    mousePos?: { x: number, y: number }
}) => {
    const maxOffset = 20
    const pupilX = 200 + (mousePos.x * maxOffset)
    const pupilY = 200 + (mousePos.y * maxOffset)

    const [phraseIndex, setPhraseIndex] = useState(0)

    // Cycle through phrases
    useEffect(() => {
        if (!main) return

        const interval = setInterval(() => {
            setPhraseIndex(prev => (prev + 1) % CRYPTIC_PHRASES.length)
        }, 5000) // Change every 5 seconds

        return () => clearInterval(interval)
    }, [main])

    return (
        <motion.svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            animate={{ scale: 1 + progress * 0.05 }}
        >
            {/* Outer Iris Rings - Simplified */}
            <motion.circle
                cx="200"
                cy="200"
                r={140 * progress}
                fill="none"
                stroke={color}
                strokeWidth="0.5"
                strokeDasharray="2 4"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                style={{ opacity: 0.2 }}
            />

            {/* Eyelids - Smoother Curves */}
            <motion.path
                d={`M 50 200 Q 200 ${200 - 140 * progress} 350 200`}
                fill="none"
                stroke={color}
                strokeWidth={main ? 2 : 1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
            />
            <motion.path
                d={`M 50 200 Q 200 ${200 + 140 * progress} 350 200`}
                fill="none"
                stroke={color}
                strokeWidth={main ? 2 : 1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
            />

            {/* Tracking Pupil Container */}
            <motion.g
                animate={{ x: pupilX - 200, y: pupilY - 200 }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
            >
                {/* Iris Boundary - Smaller to fit */}
                <circle
                    cx="200"
                    cy="200"
                    r={45 * progress}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    opacity="0.8"
                />

                {/* Internal Fourier Series Animation */}
                {main && (
                    <g transform="translate(200, 200)">
                        {[...Array(3)].map((_, i) => (
                            <motion.g
                                key={i}
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 4 + i * 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                    repeatType: "loop"
                                }}
                            >
                                <circle
                                    cx={15 + i * 10}
                                    cy="0"
                                    r={4}
                                    fill={color}
                                    opacity={0.6 - i * 0.15}
                                />
                                <circle
                                    cx="0"
                                    cy="0"
                                    r={15 + i * 10}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="0.5"
                                    opacity={0.4}
                                />
                            </motion.g>
                        ))}
                        {/* Central Core */}
                        <circle cx="0" cy="0" r="4" fill="#fff" />
                    </g>
                )}

                {/* Pupil Fill (if not main) */}
                {!main && (
                    <circle
                        cx="200"
                        cy="200"
                        r={25 * progress}
                        fill={color}
                        opacity="0.5"
                    />
                )}
            </motion.g>

            {/* Cryptic Lynch-Inspired Text */}
            {main && progress > 0.8 && (
                <motion.text
                    key={phraseIndex} // Re-trigger animation on phrase change
                    x="200"
                    y="360"
                    textAnchor="middle"
                    fill={color}
                    fontSize="10"
                    fontFamily="monospace"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.8, 0.2, 0.8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                    {CRYPTIC_PHRASES[phraseIndex]}
                </motion.text>
            )}
        </motion.svg>
    )
}
