import { motion } from 'framer-motion';

/**
 * Consistent page content wrapper.
 * Every page's content goes inside this — ensures uniform padding and max-width.
 */
export default function PageContainer({ children, className = '' }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        padding: '24px',
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        flex: 1,
      }}
      className={className}
    >
      {children}
    </motion.main>
  );
}
