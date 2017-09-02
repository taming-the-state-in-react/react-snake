import React, { Component } from 'react';
import cs from 'classnames';

import './App.css';

const TICK_RATE = 100;
const GRID_SIZE = 35;
const GRID = [];

for (let i = 0; i <= GRID_SIZE; i++) {
  GRID.push(i);
}

const DIRECTIONS = {
  UP: 'UP',
  BOTTOM: 'BOTTOM',
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
};

const DIRECTION_TICKS = {
  UP: (x, y) => ({ x, y: y - 1 }),
  BOTTOM: (x, y) => ({ x, y: y + 1 }),
  RIGHT: (x, y) => ({ x: x + 1, y }),
  LEFT: (x, y) => ({ x: x - 1, y }),
};

const KEY_CODES_MAPPER = {
  38: 'UP',
  39: 'RIGHT',
  37: 'LEFT',
  40: 'BOTTOM',
};

const isBorder = (x, y) =>
  x === 0 || y === 0 || x === GRID_SIZE || y === GRID_SIZE;

const isPosition = (x, y, diffX, diffY) =>
  x === diffX && y === diffY;

const getCellCs = (snake, snack, x, y) =>
  cs(
    'grid-cell',
    {
      'grid-cell-border': isBorder(x, y),
      'grid-cell-snake': isPosition(x, y, snake.coordinate.x, snake.coordinate.y),
      'grid-cell-snack': isPosition(x, y, snack.coordinate.x, snack.coordinate.y),
    }
  );

const applySnakePosition = (prevState) => {
  const directionFn = DIRECTION_TICKS[prevState.playground.direction];
  const coordinate = directionFn(prevState.snake.coordinate.x, prevState.snake.coordinate.y);

  return {
    snake: {
      coordinate,
    },
  };
};

const doChangeDirection = (direction) => () => ({
  playground: {
    direction,
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playground: {
        direction: DIRECTIONS.RIGHT,
      },
      snake: {
        coordinate: {
          x: 20,
          y: 10,
        },
      },
      snack: {
        coordinate: {
          x: 25,
          y: 10,
        },
      }
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

  onChangeDirection = (event) => {
    if (KEY_CODES_MAPPER[event.keyCode]) {
      this.setState(doChangeDirection(KEY_CODES_MAPPER[event.keyCode]));
    }
  }

  onTick = () => {
    this.setState(applySnakePosition);
  }

  render() {
    const {
      snake,
      snack,
    } = this.state;

    return (
      <div className="app">
        <h1>Snake!</h1>
        <Grid
          snake={snake}
          snack={snack}
        />
      </div>
    );
  }
}

const Grid = ({ snake, snack }) =>
  <div>
    {GRID.map(y =>
      <Row
        y={y}
        key={y}
        snake={snake}
        snack={snack}
      />
    )}
  </div>

const Row = ({ snake, snack, y }) =>
  <div className="grid-row">
    {GRID.map(x =>
      <Cell
        x={x}
        y={y}
        key={x}
        snake={snake}
        snack={snack}
      />
    )}
  </div>

const Cell = ({ snake, snack, x, y }) =>
  <div className={getCellCs(snake, snack, x, y)} />

export default App;