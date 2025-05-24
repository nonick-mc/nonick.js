'use client';

import { type HTMLMotionProps, motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

const fadeInUpContainerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.2, 0.8, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export function FadeInUp({
  ...props
}: PropsWithChildren<Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'animate' | 'exit'>>) {
  return (
    <motion.div
      variants={fadeInUpContainerVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      {...props}
    />
  );
}
