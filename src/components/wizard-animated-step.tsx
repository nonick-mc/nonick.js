import { LazyMotion, domAnimation, m } from 'framer-motion';
import type React from 'react';
import { type PropsWithChildren, useEffect } from 'react';
import { useWizard } from 'react-use-wizard';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? -30 : 30,
    opacity: 0,
  }),
};

type Props = {
  previousStep: React.RefObject<number>;
};

export function AnimatedStep({
  children,
  previousStep: previousStepIndex,
}: PropsWithChildren<Props>) {
  const { activeStep } = useWizard();

  useEffect(() => {
    return () => {
      previousStepIndex.current = activeStep;
    };
  }, [activeStep, previousStepIndex]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        animate='center'
        custom={activeStep - previousStepIndex.current}
        exit='exit'
        initial='exit'
        transition={{
          y: {
            ease: 'backOut',
            duration: 0.35,
          },
          opacity: { duration: 0.4 },
        }}
        variants={variants}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
