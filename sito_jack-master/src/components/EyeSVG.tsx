import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const CRYPTIC_PHRASES = [
    "OBSERVING",
    "THE FROGS ARE NOT WHAT THEY SEEM",
    "THROUGH THE DARKNESS OF FUTURE PAST",
    "IT IS HAPPENING AGAIN",
    "THE GLOW FADES SLOWLY",
    "WHERE WE'RE FROM, THE FROGS SING A PRETTY SONG",
    "MEANWHILE",
    "BLUE ROSE",
    "I'LL SEE YOU IN 25 YEARS",
    "POOPER... POOPER...",
    "THE MYSTERY OF MOTHER ISN'T A PROBLEM TO SOLVE",
    "FALLING, FALLING",
    "GARMONBOZIA",
]

export const EyeSVG = ({
    progress,
    color,
    main = false
}: {
    progress: number,
    color: string,
    main?: boolean
}) => {
    const [phraseIndex, setPhraseIndex] = useState(0)
    const [showPhrase, setShowPhrase] = useState(false)
    const [fourierTime, setFourierTime] = useState(0)

    // Sporadic phrase appearance
    useEffect(() => {
        if (!main) return

        const scheduleNext = () => {
            const randomDelay = 20000 + Math.random() * 20000

            setTimeout(() => {
                setShowPhrase(true)
                setPhraseIndex(Math.floor(Math.random() * CRYPTIC_PHRASES.length))

                setTimeout(() => {
                    setShowPhrase(false)
                    scheduleNext()
                }, 4000)
            }, randomDelay)
        }

        scheduleNext()
    }, [main])

    useEffect(() => {
        const handleInteraction = () => {
            setShowPhrase(true)
            setPhraseIndex(Math.floor(Math.random() * CRYPTIC_PHRASES.length))
            setTimeout(() => setShowPhrase(false), 4000)
        }

        window.addEventListener('lunarInteraction', handleInteraction)
        return () => window.removeEventListener('lunarInteraction', handleInteraction)
    }, [])

    // Fourier-based pupil movement
    useEffect(() => {
        if (!main) return

        const animate = () => {
            setFourierTime(prev => prev + 0.02)
            requestAnimationFrame(animate)
        }

        const frameId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frameId)
    }, [main])

    // Calculate pupil position using Fourier series
    const getPupilPosition = () => {
        if (!main) return { x: 200, y: 200 }

        // Combine multiple frequencies for organic movement
        const x = 200 + (
            15 * Math.sin(fourierTime * 0.7) +
            8 * Math.sin(fourierTime * 1.3 + 1) +
            4 * Math.sin(fourierTime * 2.1 + 2)
        )

        const y = 200 + (
            15 * Math.cos(fourierTime * 0.5) +
            8 * Math.cos(fourierTime * 1.1 + 0.5) +
            4 * Math.cos(fourierTime * 1.9 + 1.5)
        )

        return { x, y }
    }

    const pupilPos = getPupilPosition()

    return (
        <motion.svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            animate={{ scale: 1 + progress * 0.05 }}
        >
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

            {/* Fourier-animated Pupil */}
            <motion.g
                animate={{ x: pupilPos.x - 200, y: pupilPos.y - 200 }}
                transition={{ type: "tween", duration: 0.1, ease: "linear" }}
            >
                <circle
                    cx="200"
                    cy="200"
                    r={45 * progress}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    opacity="0.8"
                />

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
                        <circle cx="0" cy="0" r="4" fill="#fff" />
                    </g>
                )}

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

            {main && progress > 0.8 && showPhrase && (
                <motion.text
                    key={phraseIndex}
                    x="200"
                    y="360"
                    textAnchor="middle"
                    fill={color}
                    fontSize="10"
                    fontFamily="monospace"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.9, 0.5, 0.9, 0] }}
                    transition={{ duration: 2, repeat: 1 }}
                >
                    {CRYPTIC_PHRASES[phraseIndex]}
                </motion.text>
            )}
        </motion.svg>
    )
}
