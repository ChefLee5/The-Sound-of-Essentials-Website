import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedPage - A wrapper component that adds cinematic transitions to pages.
 */
const AnimatedPage = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1] // Custom "gentle" ease-out
            }}
            style={{ width: '100%' }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedPage;
