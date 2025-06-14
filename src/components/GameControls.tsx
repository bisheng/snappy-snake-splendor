
import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Play, RotateCcw } from 'lucide-react';
import { Direction } from '../hooks/useSnakeGame';

interface GameControlsProps {
  gameStarted: boolean;
  gameOver: boolean;
  onStart: () => void;
  onReset: () => void;
  onDirectionChange: (direction: Direction) => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameStarted,
  gameOver,
  onStart,
  onReset,
  onDirectionChange,
}) => {
  const handleDirectionClick = (direction: Direction) => {
    if (!gameStarted || gameOver) return;
    onDirectionChange(direction);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Game Control Buttons */}
      <div className="flex gap-4">
        {!gameStarted && !gameOver && (
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Play size={20} />
            开始游戏
          </button>
        )}
        
        {(gameStarted || gameOver) && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <RotateCcw size={20} />
            重置游戏
          </button>
        )}
      </div>

      {/* Mobile Direction Controls */}
      <div className="flex flex-col items-center gap-2 md:hidden">
        <button
          onClick={() => handleDirectionClick({ x: 0, y: -1 })}
          disabled={!gameStarted || gameOver}
          className="p-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:text-gray-500 hover:bg-blue-600 transition-colors shadow-lg"
        >
          <ChevronUp size={24} />
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleDirectionClick({ x: -1, y: 0 })}
            disabled={!gameStarted || gameOver}
            className="p-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:text-gray-500 hover:bg-blue-600 transition-colors shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={() => handleDirectionClick({ x: 1, y: 0 })}
            disabled={!gameStarted || gameOver}
            className="p-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:text-gray-500 hover:bg-blue-600 transition-colors shadow-lg"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        <button
          onClick={() => handleDirectionClick({ x: 0, y: 1 })}
          disabled={!gameStarted || gameOver}
          className="p-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:text-gray-500 hover:bg-blue-600 transition-colors shadow-lg"
        >
          <ChevronDown size={24} />
        </button>
      </div>
    </div>
  );
};
