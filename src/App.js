import React, { Component } from 'react';
import cs from 'classnames';

import { some } from 'lodash';

import './App.css';

var GRID_ARRAY = [];

for (var i = 0; i <= 50; i++) {
  GRID_ARRAY.push(i);
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

const isPosition = (x, y, diffX, diffY) =>
  x === diffX && y === diffY;

const get = (array, property) =>
  array.map(v => v[property]);

// TODO make own some, use compose
const isSnake = (x, y, snakeCoordinates) => {
  for (var i = 0; i < snakeCoordinates.length; i++) {
    if (isPosition(snakeCoordinates[i].x, snakeCoordinates[i].y, x, y)) {
      return true;
    }
  }
  return false;
}

// TODO compose instead: direction ticks
// TODO make last a previous compose step
const applySnakePosition = (prevState) => {
  // TODO babel stage
  // const [...snakeCoordinatesWithoutLast, lastCoordinate] = prevState.snake.coordinates;

  // const snakeCoordinatesWithoutLast = prevState.snake.coordinates.slice()

  const snakeHead = DIRECTION_TICKS[prevState.controls.direction](
    prevState.snake.coordinates[0].x,
    prevState.snake.coordinates[0].y,
  );

  const isSnakeEating = getIsSnakeEating(prevState);
  const snakeTail = isSnakeEating
    ? prevState.snake.coordinates
    : prevState.snake.coordinates.slice(0, prevState.snake.coordinates.length - 1)

  return {
    snake: {
      coordinates: [snakeHead].concat(snakeTail)
    },
  };
};

const doChangeDirection = (direction) => () => ({
  controls: {
    direction,
  },
});

const getIsSnakeEating = ({ snake, snack }) =>
 isPosition(snake.coordinates[0].x, snake.coordinates[0].y, snack.coordinate.x, snack.coordinate.y)

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls: {
        direction: CONTROLS.RIGHT,
      },
      snake: {
        coordinates: [{
          x: 10,
          y: 25,
        }],
      },
      snack: {
        coordinate: {
          x: 40,
          y: 25,
        },
      },
    };

  }

  componentDidMount() {
    this.interval = setInterval(this.onTick, 150);

    window.addEventListener('keyup', this.onChangeDirection, false);
  }

  componentWillUnmount() {
    clearInterval(this.interval);

    window.removeEventListener('keyup', this.onChangeDirection, false);
  }

  onTick = () => {
    this.setState(applySnakePosition);
  }

  onChangeDirection = (e) => {
    if (KEY_CODES_MAPPER[e.keyCode]) {
      this.setState(doChangeDirection(KEY_CODES_MAPPER[e.keyCode]));
    }
  }

  render() {
    const { snake, snack } = this.state
    return (
      <div>
        <Grid
          snake={snake}
          snack={snack}
        />
      </div>
    );
  }
}

const Grid = ({ snake, snack }) =>
  <div className="grid">
    {GRID_ARRAY.map(y => <Row
      y={y}
      key={y}
      snake={snake}
      snack={snack}
    />)}
  </div>

const Row = ({ snake, snack, y }) =>
  <div className="grid-row">
    {GRID_ARRAY.map(x => <Cell
      x={x}
      y={y}
      key={x}
      snake={snake}
      snack={snack}
    />)}
  </div>

const Cell = ({
  snake,
  snack,
  x,
  y,
}) => {
  const cellCs = cs(
    "grid-cell",
    {
      "grid-cell-snake": isSnake(x, y, snake.coordinates),
      "grid-cell-snack": isPosition(x, y, snack.coordinate.x, snack.coordinate.y),
    }
  );

  return <div className={cellCs} />;
}

export default App;
