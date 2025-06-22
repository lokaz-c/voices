'use client';

import { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

interface TextToSpeechProps {
  text: string;
  title: string;
}

export default function TextToSpeech({ text, title }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (speechRef.current) {
        window.speechSynthesis.resume();
      } else {
        // Create new speech utterance
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = `${title}. ${text}`;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
          setIsPlaying(false);
          speechRef.current = null;
        };
        
        utterance.onpause = () => {
          setIsPlaying(false);
        };
        
        utterance.onresume = () => {
          setIsPlaying(true);
        };

        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (!isSupported) return;
    
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    speechRef.current = null;
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg border border-green-200">
      <SpeakerWaveIcon className="h-5 w-5 text-green-600" />
      <span className="text-sm font-medium text-gray-700">Listen to this article:</span>
      <button
        onClick={handlePlayPause}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <PauseIcon className="h-4 w-4" />
        ) : (
          <PlayIcon className="h-4 w-4" />
        )}
      </button>
      {isPlaying && (
        <button
          onClick={handleStop}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Stop
        </button>
      )}
    </div>
  );
} 