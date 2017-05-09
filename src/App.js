import React, { Component } from 'react';
import cs from 'classnames';

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

// TODO compose instead
const applySnakePosition = (prevState) => ({
  snake: {
    position: {
      ...DIRECTION_TICKS[prevState.controls.direction](prevState.snake.position.x, prevState.snake.position.y),
    },
  },
});

const doChangeDirection = (direction) => () => ({
  controls: {
    direction,
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls: {
        direction: CONTROLS.RIGHT,
      },
      snake: {
        position: {
          x: 10,
          y: 25,
        },
      },
      snack: {
        position: {
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
    console.log(this.state.controls.direction);;
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

const isPosition = (x, y, diffX, diffY) =>
  x === diffX && y === diffY;

const Cell = ({
  snake,
  snack,
  x,
  y,
}) => {
  const cellCs = cs(
    "grid-cell",
    {
      "grid-cell-snake": isPosition(x, y, snake.position.x, snake.position.y),
      "grid-cell-snack": isPosition(x, y, snack.position.x, snack.position.y),
    }
  );

  return <div className={cellCs} />;
}

export default App;
