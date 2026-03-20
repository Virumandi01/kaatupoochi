/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommitSlide from './CommitSlide';

interface Props {
  commits: any[];
  explanations: any[];
}

export default function Slideshow({ commits, explanations }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (current < commits.length - 1) {
      setDirection(1);
      setCurrent(current + 1);
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent(current - 1);
    }
  };

  const explanation = explanations.find(
    (e) => e.id === commits[current]?.id
  )?.simple_explanation || 'Explaining...';

  return (
    <div className="w-full max-w-3xl">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {commits.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-green-400 w-6' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Slide */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -100 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <CommitSlide
            commit={commits[current]}
            explanation={explanation}
            slideNumber={current + 1}
            total={commits.length}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-30
                     rounded-xl font-medium transition-all duration-200"
        >
          Previous
        </button>

        <span className="text-gray-500 self-center text-sm">
          {current + 1} of {commits.length}
        </span>

        <button
          onClick={goNext}
          disabled={current === commits.length - 1}
          className="px-6 py-3 bg-green-500 hover:bg-green-400 disabled:opacity-30
                     text-black font-bold rounded-xl transition-all duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}