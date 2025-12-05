
import { motion } from 'framer-motion'

export const EyeSVG = ({ progress, color, main = false }: { progress: number, color: string, main?: boolean }) => (
    <motion.svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        animate={{ scale: 1 + progress * 0.1 }}
    >
        {/* Outer Iris Rings */}
        <motion.circle
            cx="200"
            cy="200"
            r={140 * progress}
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeDasharray="4 4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ opacity: 0.3 }}
        />
        <motion.circle
            cx="200"
            cy="200"
            r={120 * progress}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            animate={{ rotate: -180 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ opacity: 0.5 }}
        />

        {/* Eyelids */}
        <motion.path
            d={`M 50 200 Q 200 ${200 - 150 * progress} 350 200`}
            fill="none"
            stroke={color}
            strokeWidth={main ? 3 : 1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
        />
        <motion.path
            d={`M 50 200 Q 200 ${200 + 150 * progress} 350 200`}
            fill="none"
            stroke={color}
            strokeWidth={main ? 3 : 1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
        />

        {/* Iris */}
        <motion.circle
            cx="200"
            cy="200"
            r={60 * progress}
            fill={main ? "url(#irisGradient)" : "none"}
            stroke={color}
            strokeWidth={main ? 0 : 2}
        />

        {/* Pupil */}
        <motion.circle
            cx="200"
            cy="200"
            r={25 * progress}
            fill={main ? "#000" : color}
            style={{ opacity: main ? 1 : 0.5 }}
        />

        {/* Glitchy Data Text */}
        {main && progress > 0.5 && (
            <motion.text
                x="200"
                y="350"
                textAnchor="middle"
                fill={color}
                fontSize="12"
                fontFamily="monospace"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 1, 0.5] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
                SYSTEM_WAKE // {Math.floor(progress * 100)}%
            </motion.text>
        )}

        {main && (
            <defs>
                <radialGradient id="irisGradient">
                    <stop offset="0%" stopColor="#2196F3" />
                    <stop offset="50%" stopColor="#00BCD4" />
                    <stop offset="100%" stopColor="#00ACC1" />
                </radialGradient>
            </defs>
        )}
    </motion.svg>
)
