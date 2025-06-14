
import { useState, useEffect, useCallback } from 'react';

export interface Position {
  x: number;
  y: number;
}

export interface Direction {
  x: number;
  y: number;
}

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position | null>(null);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setFood(generateFood());
  }, [generateFood]);

  const resetGame = useCallback(() => {
    setGameStarted(false);
    setGameOver(false);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setFood(null);
  }, []);

  const changeDirection = useCallback((newDirection: Direction) => {
    setDirection(prevDirection => {
      // Prevent reversing into the snake's body
      if (
        (newDirection.x === -prevDirection.x && newDirection.y === prevDirection.y) ||
        (newDirection.y === -prevDirection.y && newDirection.x === prevDirection.x)
      ) {
        return prevDirection;
      }
      return newDirection;
    });
  }, []);

  const moveSnake = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (food && head.x === food.x && head.y === food.y) {
        setScore(prevScore => prevScore + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameStarted, gameOver, generateFood]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake, gameStarted, gameOver]);

  // Initialize food when game starts
  useEffect(() => {
    if (gameStarted && !food) {
      setFood(generateFood());
    }
  }, [gameStarted, food, generateFood]);

  return {
    snake,
    food,
    direction,
    gameOver,
    score,
    gameStarted,
    startGame,
    resetGame,
    changeDirection,
  };
};
