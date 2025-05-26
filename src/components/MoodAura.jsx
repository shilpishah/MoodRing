import React from 'react';
import { motion } from 'framer-motion';
import emotionData from '../data/emotionData';

export default function MoodAura({ emotion, phrase, song }) {
  const mood = emotionData[emotion] || {
    gradient: 'from-gray-700 via-gray-800 to-gray-900',
  };

  return (
    <div className="relative h-[320px] w-[320px] sm:h-screen sm:w-screen flex flex-col justify-center items-center text-center bg-white overflow-hidden">
      <motion.div
        className={`absolute w-[120vmax] h-[120vmax] rounded-full blur-3xl opacity-90 animate-pulse z-0`}
        style={{ background: mood.hexGradient }}
        initial={{ scale: 0.9, opacity: 0.8 }}
        animate={{ scale: 1.05, opacity: 1 }}
        transition={{ repeat: Infinity, duration: 3, repeatType: 'reverse' }}
      ></motion.div>

      <motion.p
        className="italic text-xs sm:text-sm text-white font-light z-10 mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Mood detected: {emotion.charAt(0) + emotion.slice(1)}
      </motion.p>

      <motion.h1
      className="text-xl sm:text-3xl font-semibold text-white drop-shadow-lg z-10 leading-snug"
      style={{ fontFamily: "'Viagram', serif" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      >
  {phrase || "psychoanalyzing..."}
  </motion.h1>

  {song && (
        <motion.a
          href={song.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-xs underline italic z-10 md:text-sm"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          listen to "{song.title}" by {song.artist}
        </motion.a>
      )}

  <motion.p
        className="absolute bottom-2 text-[0.65rem] sm:text-xs text-white/60 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        moodring — beta build © shilpi shah 2025
      </motion.p>

    </div>
  );
}
