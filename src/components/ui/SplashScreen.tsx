import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield } from 'lucide-react';

interface SplashScreenProps {
  onExpand?: () => void;
  onComplete: () => void;
}

export function SplashScreen({ onExpand, onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'intro' | 'expand' | 'done'>('intro');

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('antiscam_splash_shown');
    if (hasSeenSplash) {
      setPhase('done');
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setPhase('expand');
      onExpand?.();
      
      sessionStorage.setItem('antiscam_splash_shown', 'true');
      
      setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 1000); // 1s for expand transition
    }, 4000); // Intro duration (approx 3.2s) + 0.8s hold time

    return () => clearTimeout(timer);
  }, [onExpand, onComplete]);

  const welcomeText = "WELCOME TO".split('');
  const antiscamText = "ANTISCAM".split('');

  const letterVariants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: 'blur(0px)',
      transition: { 
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  if (phase === 'done') return null;

  return (
    <motion.div
      initial={{ backgroundColor: 'var(--color-background)' }}
      animate={{ 
        backgroundColor: phase === 'expand' ? 'rgba(12, 19, 36, 0)' : 'rgba(12, 19, 36, 1)',
        backdropFilter: phase === 'expand' ? 'blur(0px)' : 'blur(0px)'
      }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden pointer-events-none"
    >
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-primary/5" 
          />
        )}
      </AnimatePresence>
      
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-center px-4 w-full">
        
        {/* LOGO */}
        <motion.div
          initial={{ y: 50, opacity: 0, filter: 'blur(15px)', scale: 1 }}
          animate={{ 
            y: 0, 
            opacity: phase === 'expand' ? 0 : 1, 
            filter: 'blur(0px)',
            scale: phase === 'expand' ? 30 : 1
          }}
          transition={{ 
            duration: phase === 'expand' ? 1 : 1.2, 
            ease: phase === 'expand' ? [0.4, 0, 0.2, 1] : [0.16, 1, 0.3, 1] 
          }}
          className="relative z-20"
        >
          <div className="relative flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: phase === 'expand' ? 0 : 1,
                boxShadow: [
                  '0 0 0px 0px rgba(173, 198, 255, 0)', 
                  '0 0 40px 10px rgba(173, 198, 255, 0.2)', 
                  '0 0 0px 0px rgba(173, 198, 255, 0)'
                ] 
              }}
              transition={{ 
                opacity: { delay: 1, duration: phase === 'expand' ? 0.3 : 1 },
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 } 
              }}
              className="absolute inset-0 rounded-full"
            />
            
            {/* Inner Glow expanding */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: phase === 'expand' ? [0, 1, 0] : 0,
                scale: phase === 'expand' ? 5 : 0
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-0 bg-primary rounded-full blur-xl"
            />

            <Shield className="w-24 h-24 md:w-28 md:h-28 text-primary relative z-10 drop-shadow-[0_0_15px_rgba(173,198,255,0.4)]" />
          </div>
        </motion.div>

        {/* TEXT - Wraps in AnimatePresence to vanish quickly during expand */}
        <AnimatePresence>
          {phase === 'intro' && (
            <motion.div 
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center gap-4 mt-2 relative z-10"
            >
              <h1 className="font-logo text-3xl md:text-5xl text-on-surface font-bold tracking-widest uppercase flex flex-wrap justify-center items-center gap-y-2">
                {/* WELCOME TO */}
                <motion.span
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.04, delayChildren: 0.6 }
                    }
                  }}
                  className="flex"
                >
                  {welcomeText.map((char, index) => (
                    <motion.span 
                      key={`w-${index}`} 
                      variants={letterVariants}
                      className={char === ' ' ? 'w-2 md:w-3' : ''}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>

                {/* ANTISCAM */}
                <motion.span
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.08, delayChildren: 1.2 }
                    }
                  }}
                  className="flex text-primary text-glow-primary ml-2 md:ml-4"
                >
                  {antiscamText.map((char, index) => (
                    <motion.span key={`a-${index}`} variants={letterVariants}>
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
              </h1>
              
              {/* SUBTITLE */}
              <motion.p
                initial={{ y: 20, opacity: 0, filter: 'blur(5px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 2.2, ease: 'easeOut' }}
                className="text-on-surface-variant text-sm md:text-base font-medium tracking-wide"
              >
                Your shield against online scams.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
