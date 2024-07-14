import { AnimatePresence, motion } from 'framer-motion';

const AnimationWrapper = ({ children, keyValue, initial = {opacity: 0, x: -100}, animate = { opacity: 1, x: 0 } }, exit = { opacity: 0, x: 100 }, transition = { duration: 0.5 }, className) => {
    return (
        <AnimatePresence>
            <motion.div
                key={keyValue}
                initial={initial}
                animate={animate}
                transition={transition}
                exit={exit}
                className={className}>
                {children}
            </motion.div>
        </AnimatePresence>

    )
}

export default AnimationWrapper;