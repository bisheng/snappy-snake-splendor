
import React, { useEffect, useRef } from 'react';
import { useSnakeGame } from '../hooks/useSnakeGame';
import { GameControls } from './GameControls';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;

export const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    snake,
    food,
    direction,
    gameOver,
    score,
    gameStarted,
    startGame,
    resetGame,
    changeDirection
  } = useSnakeGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid
    ctx.strokeStyle = '#16213e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const gradient = ctx.createLinearGradient(
        segment.x * GRID_SIZE, 
        segment.y * GRID_SIZE,
        segment.x * GRID_SIZE + GRID_SIZE, 
        segment.y * GRID_SIZE + GRID_SIZE
      );
      
      if (index === 0) {
        // Snake head
        gradient.addColorStop(0, '#00f5ff');
        gradient.addColorStop(1, '#0099cc');
      } else {
        // Snake body
        gradient.addColorStop(0, '#00cc66');
        gradient.addColorStop(1, '#009933');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
      
      // Add shine effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(
        segment.x * GRID_SIZE + 2,
        segment.y * GRID_SIZE + 2,
        GRID_SIZE - 10,
        3
      );
    });

    // Draw food
    if (food) {
      const foodGradient = ctx.createRadialGradient(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        0,
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2
      );
      foodGradient.addColorStop(0, '#ff6b6b');
      foodGradient.addColorStop(1, '#ee5a24');
      
      ctx.fillStyle = foodGradient;
      ctx.beginPath();
      ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
      
      // Add sparkle effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 3,
        food.y * GRID_SIZE + GRID_SIZE / 3,
        2,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  }, [snake, food]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted && !gameOver) return;
      
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          e.preventDefault();
          changeDirection({ x: 0, y: -1 });
          break;
        case 's':
        case 'arrowdown':
          e.preventDefault();
          changeDirection({ x: 0, y: 1 });
          break;
        case 'a':
        case 'arrowleft':
          e.preventDefault();
          changeDirection({ x: -1, y: 0 });
          break;
        case 'd':
        case 'arrowright':
          e.preventDefault();
          changeDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, changeDirection]);

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
          贪吃蛇游戏
        </h1>
        <div className="text-2xl font-semibold text-gray-700">
          得分: <span className="text-blue-600">{score}</span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border-4 border-gray-300 rounded-lg shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800"
        />
        
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <div className="text-center text-white">
              <div className="text-xl mb-4">按开始游戏开始</div>
              <div className="text-sm opacity-75">使用 WASD 或方向键控制</div>
            </div>
          </div>
        )}
        
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
            <div className="text-center text-white">
              <div className="text-2xl font-bold mb-2">游戏结束!</div>
              <div className="text-lg mb-4">最终得分: {score}</div>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105"
              >
                重新开始
              </button>
            </div>
          </div>
        )}
      </div>

      <GameControls
        gameStarted={gameStarted}
        gameOver={gameOver}
        onStart={startGame}
        onReset={resetGame}
        onDirectionChange={changeDirection}
      />

      <div className="text-center text-gray-600 max-w-md">
        <p className="text-sm">
          使用 <span className="font-semibold">WASD</span> 或 <span className="font-semibold">方向键</span> 控制蛇的移动
        </p>
        <p className="text-sm mt-1">
          吃掉红色食物来增长蛇身并获得分数！
        </p>
      </div>
    </div>
  );
};
