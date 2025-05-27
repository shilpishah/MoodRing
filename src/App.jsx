import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDynamicPhrase } from './utils/fetchPhrase';
import MoodAura from './components/MoodAura';
import fetchEmotion from './utils/fetchEmotion';
import './index.css';

import happyPing from './assets/sounds/happyMR.mp3';
import relaxPing from './assets/sounds/relaxMR.mp3';
import sadPing from './assets/sounds/sadMR.mp3';
import yuckPing from './assets/sounds/grossMR.mp3';
import calmPing from './assets/sounds/calmMR.mp3';

const emotionPings = {
  happy: happyPing,
  sad: sadPing,
  anger: relaxPing,
  fear: relaxPing,
  surprise: calmPing,
  disgust: yuckPing,
  calm: calmPing,
  overstimulated: relaxPing,
  stress: relaxPing
};

export default function App() {
  const [emotionData, setEmotionData] = useState(null);
  const [currEmotion, setCurrEmotion] = useState(null);
  const [canPlaySound, setCanPlaySound] = useState(false);
  const [phrase, setPhrase] = useState(null);
  const [song, setSong] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await fetchEmotion();
        if (data.emotion !== currEmotion) {
          setCurrEmotion(data.emotion);
          setEmotionData(data);

          const currentHour = new Date().getHours();
          const timeOfDay = currentHour < 12 ? "morning" : currentHour < 18 ? "afternoon" : "evening";
          const ageGroup = "18-25";
          const fetched = await fetchDynamicPhrase(data.emotion, ageGroup, timeOfDay);
          
          setPhrase(fetched.phrase);
          setSong(fetched.song);




          if (canPlaySound) {
            const ping = emotionPings[data.emotion];
            if (ping) {
              const audio = new Audio(ping);
              if (["relax", "stress", "overstimulated", "anger", "fear"].includes(data.emotion)) {
                audio.volume = 1.0;
              } else {
                audio.volume = 0.7;
              }
              audio.play().catch(err => console.error('Autoplay blocked or audio error', err));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching emotion:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currEmotion, canPlaySound]);

  if (!emotionData) {
    return (
      <div className="flex items-center justify-center h-[320px] w-[320px] md:h-screen md:w-screen bg-black text-white text-xl">
        loading your MoodRing...
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key={emotionData.emotion}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 1 }}
        className="relative h-[100svh] w-[100svw] md:h-screen md:w-screen min-h-screen min-w-full flex flex-col justify-center items-center overflow-hidden"
      >
        {!canPlaySound && (
          <button
            className="absolute top-3 right-3 bg-white/20 backdrop-blur-lg text-white border border-white/30 px-3 py-1.5 text-xs rounded-xl shadow-lg z-50 hover:bg-white/30 transition-all duration-300 md:top-5 md:right-5 md:text-sm md:px-4 md:py-2"
            onClick={() => {
              setCanPlaySound(true);
              const dummy = new Audio();
              dummy.play().catch(() => {});
            }}
          >
            Enable Sound
          </button>
        )}

        <MoodAura emotion={emotionData.emotion} phrase={phrase} song={song} />
      </motion.div>
    </AnimatePresence>
  );
}
