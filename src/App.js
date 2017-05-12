import React, { Component } from 'react';
import cs from 'classnames';

import './App.css';

const GRID_SIZE = 20;
const TICK_RATE = 100;
const GRID = [];

for (let i = 0; i <= GRID_SIZE; i++) {
  GRID.push(i);
}

const KEY_CODES_MAPPER = {
  38: 'UP',
  39: 'RIGHT',
  37: 'LEFT',
  40: 'BOTTOM',
};

const CONTROLS = {
  UP: 'UP',
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  BOTTOM: 'BOTTOM',
};

const DIRECTION_TICKS = {
  UP: (x, y) => ({ x, y: y - 1 }),
  BOTTOM: (x, y) => ({ x, y: y + 1 }),
  RIGHT: (x, y) => ({ x: x + 1, y }),
  LEFT: (x, y) => ({ x: x - 1, y }),
};

const getIsGameOver = (state) =>
  state.playground.isGameOver;

const getIsAllowedToChangeDirection = (state, e) =>
  !getIsGameOver(state) && KEY_CODES_MAPPER[e.keyCode];

const getRandomNumberFromRange = (min, max) =>
  Math.floor(Math.random() * (max - min +1 ) + min);

const getRandomCoordinate = () =>
  ({
    x: getRandomNumberFromRange(1, GRID_SIZE - 1),
    y: getRandomNumberFromRange(1, GRID_SIZE - 1),
  });

const isPosition = (x, y, diffX, diffY) =>
  x === diffX && y === diffY;

const isSnake = (x, y, snakeCoordinates) =>
  snakeCoordinates.filter(coordinate => isPosition(coordinate.x, coordinate.y, x, y)).length;

const getSnakeHead = (snake) =>
  snake.coordinates[0];

const getSnakeWithoutStub = (snake) =>
  snake.coordinates.slice(0, snake.coordinates.length - 1);

const getSnakeTail = (snake) =>
  snake.coordinates.slice(1);

const getIsSnakeOutside = (snake) =>
  getSnakeHead(snake).x >= GRID_SIZE ||
  getSnakeHead(snake).y >= GRID_SIZE ||
  getSnakeHead(snake).x <= 0 ||
  getSnakeHead(snake).y <= 0;

const getIsSnakeClumy = (snake) =>
  isSnake(getSnakeHead(snake).x, getSnakeHead(snake).y, getSnakeTail(snake));

// apply FP
const getIsSnakeEating = ({ snake, snack }) =>
 isPosition(getSnakeHead(snake).x, getSnakeHead(snake).y, snack.coordinate.x, snack.coordinate.y);

const applyGameOver = (prevState) => ({
  playground: {
    isGameOver: true
  },
})

// TODO compose instead: direction ticks
// TODO make last a previous compose step
const applySnakePosition = (prevState) => {
  const isSnakeEating = getIsSnakeEating(prevState);

  const snakeHead = DIRECTION_TICKS[prevState.playground.direction](
    getSnakeHead(prevState.snake).x,
    getSnakeHead(prevState.snake).y,
  );

  const snakeTail = isSnakeEating
    ? prevState.snake.coordinates
    : getSnakeWithoutStub(prevState.snake);

  const snackCoordinate = isSnakeEating
   ? getRandomCoordinate()
   : prevState.snack.coordinate;

  return {
    snake: {
      coordinates: [snakeHead, ...snakeTail],
    },
    snack: {
      coordinate: snackCoordinate,
    },
  };
};

const doChangeDirection = (direction) => () => ({
  playground: {
    direction,
  },
});

const getCellCs = (isGameOver, snake, snack, x, y) =>
  cs(
    'grid-cell',
    {
      'grid-cell-snake': isSnake(x, y, snake.coordinates),
      'grid-cell-snack': isPosition(x, y, snack.coordinate.x, snack.coordinate.y),
      'grid-cell-border': x === 0 || y === 0 || x === GRID_SIZE || y === GRID_SIZE,
      'grid-cell-hit': isGameOver && isPosition(x, y, getSnakeHead(snake).x, getSnakeHead(snake).y),
    }
  );

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playground: {
        direction: CONTROLS.RIGHT,
        isGameOver: false,
      },
      snake: {
        coordinates: [getRandomCoordinate()],
      },
      snack: {
        coordinate: getRandomCoordinate(),
      },
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.onTick, TICK_RATE);

    window.addEventListener('keyup', this.onChangeDirection, false);
  }

  componentWillUnmount() {
    clearInterval(this.interval);

    window.removeEventListener('keyup', this.onChangeDirection, false);
  }

  onTick = () => {
    getIsSnakeOutside(this.state.snake) || getIsSnakeClumy(this.state.snake)
      ? this.setState(applyGameOver)
      : this.setState(applySnakePosition);
  }

  onChangeDirection = (e) => {
    if (getIsAllowedToChangeDirection(this.state, e)) {
      this.setState(doChangeDirection(KEY_CODES_MAPPER[e.keyCode]));
    }
  }

  render() {
    const {
      playground,
      snake,
      snack,
    } = this.state;

    const {
      isGameOver,
    } = playground;

    return (
      <div>
        <Grid
          snake={snake}
          snack={snack}
          isGameOver={isGameOver}
        />
      </div>
    );
  }
}

const Grid = ({ isGameOver, snake, snack }) =>
  <div className="grid">
    {GRID.map(y => <Row
      y={y}
      key={y}
      snake={snake}
      snack={snack}
      isGameOver={isGameOver}
    />)}
  </div>

const Row = ({ isGameOver, snake, snack, y }) =>
  <div className="grid-row">
    {GRID.map(x => <Cell
      x={x}
      y={y}
      key={x}
      snake={snake}
      snack={snack}
      isGameOver={isGameOver}
    />)}
  </div>

const Cell = ({ isGameOver, snake, snack, x, y }) =>
  <div className={getCellCs(isGameOver, snake, snack, x, y)} />;

export default App;
