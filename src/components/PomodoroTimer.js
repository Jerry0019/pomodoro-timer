import React, { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css';

const PomodoroTimer = () => {
  const [time, setTime] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('pomodoro');

  const timerRef = useRef(null);

  const modes = {
    pomodoro: { name: 'Pomodoro', time: 1500 },
    shortBreak: { name: 'Short Break', time: 300 },
    longBreak: { name: 'Long Break', time: 900 },
  };

  useEffect(() => {
    if (isActive && time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(timerRef.current);
      setIsActive(false);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, time]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = (newMode) => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setMode(newMode);
    setTime(modes[newMode].time);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    const totalTime = modes[mode].time;
    return ((totalTime - time) / totalTime) * 100;
  };

  return (
  <div className='pomodoro-header'>
    <h1>Pomodoro Timer</h1>
    <div className="pomodoro-timer">
      <div className="mode-buttons">
        {Object.entries(modes).map(([key, { name }]) => (
          <button
            key={key}
            className={mode === key ? 'active' : ''}
            onClick={() => resetTimer(key)}
          >
            {name}
          </button>
        ))}
        
      </div>
      <div className="timer-container">
        <svg className="progress-ring" viewBox="0 0 100 100">
          <circle className="progress-ring-circle" cx="50" cy="50" r="45" />
          <circle 
            className="progress-ring-circle-progress" 
            cx="50" 
            cy="50" 
            r="45"
            style={{
              strokeDasharray: `${calculateProgress()}, 100`
            }}
          />
        </svg>
        <div className="timer">{formatTime(time)}</div>
      </div>
      <button className="start-button" onClick={toggleTimer}>
        {isActive ? 'Pause' : 'Start'}
      </button>
    </div>
    </div>
  );
};

export default PomodoroTimer;