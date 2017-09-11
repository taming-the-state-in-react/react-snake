# React Snake (Functional Style)

* Found in [Taming the State in React](https://roadtoreact.com/course-details?courseId=TAMING_THE_STATE)
* [Live](https://react-snake.wieruch.com/)

![sep-02-2017 17-09-49](https://user-images.githubusercontent.com/2479967/29996581-94a6c5a2-9001-11e7-85d6-3e60828a9deb.gif)

## Features

* uses:
  * only React (create-react-app)

## Installation

* `git clone git@github.com:rwieruch/react-snake.git`
* `cd react-snake`
* `npm install`
* `npm start`
* visit http://localhost:3000/

## Releases

* [Part 01](https://github.com/rwieruch/react-snake/tree/1.0.0)
* [Part 02](https://github.com/rwieruch/react-snake/tree/2.0.0)
* [Part 03](https://github.com/rwieruch/react-snake/tree/3.0.0)
* [Part 04](https://github.com/rwieruch/react-snake/tree/4.0.0)
* [Part 05](https://github.com/rwieruch/react-snake/tree/5.0.0)

## Bonus: Draft Instructions (Taken from Screencasts)

* create-react-app react-snake
* cd react-snake
* sublime .
* npm start

# Part 1: The Playground

- drawing a grid

{title="Editor: src/App.css",lang="css"}
~~~~~~~~
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grid-row {
  display: flex;
  flex-direction: row;
}

.grid-cell {
  border-top: 1px solid #000000;
  border-left: 1px solid #000000;

  width: 15px;
  height: 15px;
}
~~~~~~~~

- generating a grid and displaying it

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
import React, { Component } from 'react';

import './App.css';

const GRID_SIZE = 35;
const GRID = [];

for (let i = 0; i <= GRID_SIZE; i++) {
  GRID.push(i);
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="app">
        <h1>Snake!</h1>
        <Grid />
      </div>
    );
  }
}

const Grid = () =>
  <div>
    {GRID.map(y =>
      <Row
        y={y}
        key={y}
      />
    )}
  </div>

const Row = ({ y }) =>
  <div className="grid-row">
    {GRID.map(x =>
      <Cell
        x={x}
        y={y}
        key={x}
      />
    )}
  </div>

const Cell = ({ x, y }) =>
  <div className="grid-cell" />

export default App;
~~~~~~~~

- grid border

{title="Editor: src/App.css",lang="css"}
~~~~~~~~
...

.grid-cell-border {
  background-color: #000000;
}
~~~~~~~~

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
...

const Cell = ({ x, y }) => {
  const cellClassname = ['grid-cell'];

  if (x === 0 || y === 0 || x === GRID_SIZE || y === GRID_SIZE) {
    cellClassname.push('grid-cell-border');
  }

  return <div className={cellClassname.join(' ')} />
};
~~~~~~~~

{title="Command Line: /",lang="text"}
~~~~~~~~
npm install --save classnames
~~~~~~~~

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
import cs from 'classnames';

...

const Cell = ({ x, y }) => {
  const cellClassname = cs('grid-cell', {
    'grid-cell-border': x === 0 || y === 0 || x === GRID_SIZE || y === GRID_SIZE,
  });

  return <div className={cellClassname} />
};
~~~~~~~~

- extract as function, because function can later be used to style cell when there is the snake or when there is a snack for the snake

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
...

const getCellCs = (x, y) =>
  cs(
    'grid-cell',
    {
      'grid-cell-border': x === 0 || y === 0 || x === GRID_SIZE || y === GRID_SIZE,
    }
  );

class App extends Component {
  ...
}

...

const Cell = ({ x, y }) =>
  <div className={getCellCs(x, y)} />
~~~~~~~~

- extract it as a function

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
...

const isBorder = (x, y) =>
  x === 0 || y === 0 || x === GRID_SIZE || y === GRID_SIZE;

const getCellCs = (x, y) =>
  cs(
    'grid-cell',
    {
      'grid-cell-border': isBorder(x, y),
    }
  );
~~~~~~~~

# Part 2: The Snake and the Snack

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
...

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
# leanpub-start-insert
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
# leanpub-end-insert
    };
  }

  ...

}

...
~~~~~~~~

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
...

class App extends Component {
  ...

  render() {
# leanpub-start-insert
    const {
      snake,
      snack,
    } = this.state;
# leanpub-end-insert

    return (
      <div className="app">
        <h1>Snake!</h1>
        <Grid
# leanpub-start-insert
          snake={snake}
          snack={snack}
# leanpub-end-insert
        />
      </div>
    );
  }
}

...
~~~~~~~~

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
...

# leanpub-start-insert
const Grid = ({ snake, snack }) =>
# leanpub-end-insert
  <div>
    {GRID.map(y =>
      <Row
        y={y}
        key={y}
# leanpub-start-insert
        snake={snake}
        snack={snack}
# leanpub-end-insert
      />
    )}
  </div>

# leanpub-start-insert
const Row = ({ snake, snack, y }) =>
# leanpub-end-insert
  <div className="grid-row">
    {GRID.map(x =>
      <Cell
        x={x}
        y={y}
        key={x}
# leanpub-start-insert
        snake={snake}
        snack={snack}
# leanpub-end-insert
      />
    )}
  </div>

# leanpub-start-insert
const Cell = ({ snake, snack, x, y }) =>
  <div className={getCellCs(snake, snack, x, y)} />
# leanpub-end-insert
~~~~~~~~

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
# leanpub-start-insert
const getCellCs = (snake, snack, x, y) =>
# leanpub-end-insert
  cs(
    'grid-cell',
    {
      'grid-cell-border': isBorder(x, y),
# leanpub-start-insert
      'grid-cell-snake': x === snake.coordinate.x && y === snake.coordinate.y,
      'grid-cell-snack': x === snack.coordinate.x && y === snack.coordinate.y,
# leanpub-end-insert
    }
  );
~~~~~~~~

{title="Editor: src/App.css",lang="css"}
~~~~~~~~
...

.grid-cell-snake {
  background-color: #000000;
}

.grid-cell-snack {
  background-color: blue;
}
~~~~~~~~

- extract a common utility function

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
# leanpub-start-insert
const isPosition = (x, y, diffX, diffY) =>
  x === diffX && y === diffY;
# leanpub-end-insert

const getCellCs = (snake, snack, x, y) =>
  cs(
    'grid-cell',
    {
      'grid-cell-border': 'grid-cell-border': isBorder(x, y),
# leanpub-start-insert
      'grid-cell-snake': isPosition(x, y, snake.coordinate.x, snake.coordinate.y),
      'grid-cell-snack': isPosition(x, y, snack.coordinate.x, snack.coordinate.y),
# leanpub-end-insert
    }
  );
~~~~~~~~

# Part 3: Move Snake, Move!

- playground state

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
# leanpub-start-insert
      playground: {
        direction: 'RIGHT',
      },
# leanpub-end-insert
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

  ...

}
~~~~~~~~

- make something happen in an intervall

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
# leanpub-start-insert
const TICK_RATE = 100;
# leanpub-end-insert
const GRID_SIZE = 35;
const GRID = [];

...

class App extends Component {
  constructor(props) {
    ...
  }

# leanpub-start-insert
  componentDidMount() {
    this.interval = setInterval(this.onTick, TICK_RATE);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onTick = () => {
    // Move Snake
  }
# leanpub-end-insert

  ...

}
~~~~~~~~

- move in one direction by state change

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
# leanpub-start-insert
const applySnakePosition = (prevState) => {
  let x;
  let y;

  if (prevState.playground.direction === 'RIGHT') {
    x = prevState.snake.coordinate.x + 1;
    y = prevState.snake.coordinate.y;
  }

  return {
    snake: {
      coordinate: {
        x,
        y,
      },
    },
  };
};
# leanpub-end-insert

...

class App extends Component {
  ...

  onTick = () => {
# leanpub-start-insert
    this.setState(applySnakePosition);
# leanpub-end-insert
  }

  ...

}
~~~~~~~~

- move in all directions depending on direction state

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
const applySnakePosition = (prevState) => {
  let x;
  let y;

  if (prevState.playground.direction === 'RIGHT') {
    x = prevState.snake.coordinate.x + 1;
    y = prevState.snake.coordinate.y;
  }

# leanpub-start-insert
  if (prevState.playground.direction === 'LEFT') {
    x = prevState.snake.coordinate.x - 1;
    y = prevState.snake.coordinate.y;
  }

  if (prevState.playground.direction === 'UP') {
    x = prevState.snake.coordinate.x;
    y = prevState.snake.coordinate.y - 1;
  }

    if (prevState.playground.direction === 'BOTTOM') {
    x = prevState.snake.coordinate.x;
    y = prevState.snake.coordinate.y + 1;
  }
# leanpub-end-insert

  return {
    snake: {
      coordinate: {
        x,
        y,
      },
    },
  };
};

...
~~~~~~~~

- extract constants

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
# leanpub-start-insert
const DIRECTIONS = {
  UP: 'UP',
  BOTTOM: 'BOTTOM',
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
};
# leanpub-end-insert

...

const applySnakePosition = (prevState) => {
  let x;
  let y;

# leanpub-start-insert
  if (prevState.playground.direction === DIRECTIONS.RIGHT) {
# leanpub-end-insert
    x = prevState.snake.coordinate.x + 1;
    y = prevState.snake.coordinate.y;
  }

# leanpub-start-insert
  if (prevState.playground.direction === DIRECTIONS.LEFT) {
# leanpub-end-insert
    x = prevState.snake.coordinate.x - 1;
    y = prevState.snake.coordinate.y;
  }

# leanpub-start-insert
  if (prevState.playground.direction === DIRECTIONS.UP) {
# leanpub-end-insert
    x = prevState.snake.coordinate.x;
    y = prevState.snake.coordinate.y - 1;
  }

# leanpub-start-insert
    if (prevState.playground.direction === DIRECTIONS.BOTTOM) {
# leanpub-end-insert
    x = prevState.snake.coordinate.x;
    y = prevState.snake.coordinate.y + 1;
  }

  return {
    snake: {
      coordinate: {
        x,
        y,
      },
    },
  };
};

...

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playground: {
# leanpub-start-insert
        direction: DIRECTIONS.RIGHT,
# leanpub-end-insert
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

...

}
~~~~~~~~

- extract coordinate function

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
# leanpub-start-insert
const DIRECTION_TICKS = {
  UP: (x, y) => ({ x, y: y - 1 }),
  BOTTOM: (x, y) => ({ x, y: y + 1 }),
  RIGHT: (x, y) => ({ x: x + 1, y }),
  LEFT: (x, y) => ({ x: x - 1, y }),
};
# leanpub-end-insert

...

const applySnakePosition = (prevState) => {
# leanpub-start-insert
  const directionFn = DIRECTION_TICKS[prevState.playground.direction];
  const coordinate = directionFn(prevState.snake.coordinate.x, prevState.snake.coordinate.y);
# leanpub-end-insert

  return {
    snake: {
# leanpub-start-insert
      coordinate,
# leanpub-end-insert
    },
  };
};
~~~~~~~~

- change direction

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
# leanpub-start-insert
const KEY_CODES_MAPPER = {
  38: 'UP',
  39: 'RIGHT',
  37: 'LEFT',
  40: 'BOTTOM',
};
# leanpub-start-insert

...

# leanpub-start-insert
const doChangeDirection = (direction) => () => ({
  playground: {
    direction,
  },
});
# leanpub-end-insert

...

class App extends Component {
  ...

  componentDidMount() {
    this.interval = setInterval(this.onTick, TICK_RATE);

# leanpub-start-insert
    window.addEventListener('keyup', this.onChangeDirection, false);
# leanpub-end-insert
  }

  componentWillUnmount() {
    clearInterval(this.interval);

# leanpub-start-insert
    window.removeEventListener('keyup', this.onChangeDirection, false);
# leanpub-end-insert
  }

# leanpub-start-insert
  onChangeDirection = (event) => {
    this.setState(doChangeDirection(KEY_CODES_MAPPER[event.keyCode]));
  }
# leanpub-end-insert

  ...

}
~~~~~~~~

- due performance issues, the onChangeDirection method should only fire when one of the keycodes was pressed

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
class App extends Component {
  ...

  onChangeDirection = (event) => {
# leanpub-start-insert
    if (KEY_CODES_MAPPER[event.keyCode]) {
# leanpub-end-insert
      this.setState(doChangeDirection(KEY_CODES_MAPPER[event.keyCode]));
# leanpub-start-insert
    }
# leanpub-end-insert
  }

  ...

}
~~~~~~~~

# Part 4: Eat and Grow

- snake is not only one coordinate, but multiple coordinates to be able to grow after each snack eaten

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playground: {
        direction: DIRECTIONS.RIGHT,
      },
      snake: {
# leanpub-start-insert
        coordinates: [{
          x: 20,
          y: 10,
        }],
# leanpub-end-insert
      },
      snack: {
        coordinate: {
          x: 25,
          y: 10,
        },
      }
    };
  }

  ...

}
~~~~~~~~

- snake needs to bis visible with multiple coordinates in hte grid

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
# leanpub-start-insert
const isSnake = (x, y, snakeCoordinates) =>
  snakeCoordinates.filter(coordinate => isPosition(coordinate.x, coordinate.y, x, y)).length;
# leanpub-end-insert

...

const getCellCs = (snake, snack, x, y) =>
  cs(
    'grid-cell',
    {
      'grid-cell-border': 'grid-cell-border': isBorder(x, y),
# leanpub-start-insert
      'grid-cell-snake': isSnake(x, y, snake.coordinates),
# leanpub-end-insert
      'grid-cell-snack': isPosition(x, y, snack.coordinate.x, snack.coordinate.y),
    }
  );
~~~~~~~~

- and update the snake head position when the snake moves

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
# leanpub-start-insert
const getSnakeHead = (snake) =>
  snake.coordinates[0];
# leanpub-start-insert

const applySnakePosition = (prevState) => {
# leanpub-start-insert
  const snakeHead = DIRECTION_TICKS[prevState.playground.direction](
    getSnakeHead(prevState.snake).x,
    getSnakeHead(prevState.snake).y,
  );
# leanpub-end-insert

  return {
    snake: {
      coordinates: [snakeHead],
    },
  };
};
~~~~~~~~

- determining that the snake is eating the snack when the snake head and the snack share the same position

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
# leanpub-start-insert
const getSnakeWithoutStub = (snake) =>
  snake.coordinates.slice(0, snake.coordinates.length - 1);

const getIsSnakeEating = ({ snake, snack }) =>
 isPosition(getSnakeHead(snake).x, getSnakeHead(snake).y, snack.coordinate.x, snack.coordinate.y);
# leanpub-end-insert

const applySnakePosition = (prevState) => {
# leanpub-start-insert
  const isSnakeEating = getIsSnakeEating(prevState);
# leanpub-end-insert

  const snakeHead = DIRECTION_TICKS[prevState.playground.direction](
    getSnakeHead(prevState.snake).x,
    getSnakeHead(prevState.snake).y,
  );

# leanpub-start-insert
  const snakeTail = isSnakeEating
    ? prevState.snake.coordinates
    : getSnakeWithoutStub(prevState.snake);
# leanpub-end-insert

  return {
    snake: {
# leanpub-start-insert
      coordinates: [snakeHead, ...snakeTail],
# leanpub-end-insert
    },
  };
};
~~~~~~~~

- snake should grow now, but the snack doesn't disappear
- the snack should disappear when the snake head hit it and a new snack should appear somewhere

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
# leanpub-start-insert
const getRandomNumberFromRange = (min, max) =>
  Math.floor(Math.random() * (max - min +1 ) + min);

const getRandomCoordinate = () =>
  ({
    x: getRandomNumberFromRange(1, GRID_SIZE - 1),
    y: getRandomNumberFromRange(1, GRID_SIZE - 1),
  });
# leanpub-end-insert

...

const applySnakePosition = (prevState) => {
  const isSnakeEating = getIsSnakeEating(prevState);

  const snakeHead = DIRECTION_TICKS[prevState.playground.direction](
    getSnakeHead(prevState.snake).x,
    getSnakeHead(prevState.snake).y,
  );

  const snakeTail = isSnakeEating
    ? prevState.snake.coordinates
    : getSnakeWithoutStub(prevState.snake);

# leanpub-start-insert
  const snackCoordinate = isSnakeEating
    ? getRandomCoordinate()
    : prevState.snack.coordinate;
# leanpub-end-insert

  return {
    snake: {
      coordinates: [snakeHead, ...snakeTail],
    },
# leanpub-start-insert
    snack: {
      coordinate: snackCoordinate,
    },
# leanpub-end-insert
  };
};
~~~~~~~~

- use the random calculator for random start positions

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playground: {
        direction: DIRECTIONS.RIGHT,
      },
      snake: {
# leanpub-start-insert
        coordinates: [getRandomCoordinate()],
# leanpub-end-insert
      },
      snack: {
# leanpub-start-insert
        coordinate: getRandomCoordinate(),
# leanpub-end-insert
      },
    };
  }

  ...

}
~~~~~~~~

# Part 5: Game Over

- allocate a state for game over

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playground: {
        direction: DIRECTIONS.RIGHT,
# leanpub-start-insert
        isGameOver: false,
# leanpub-end-insert
      },
      snake: {
        coordinates: [getRandomCoordinate()],
      },
      snack: {
        coordinate: getRandomCoordinate(),
      },
    };
  }

  ...

}
~~~~~~~~

- evaluate when game is over

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
# leanpub-start-insert
const getSnakeTail = (snake) =>
  snake.coordinates.slice(1);

const getIsSnakeOutside = (snake) =>
  getSnakeHead(snake).x >= GRID_SIZE ||
  getSnakeHead(snake).y >= GRID_SIZE ||
  getSnakeHead(snake).x <= 0 ||
  getSnakeHead(snake).y <= 0;

const getIsSnakeClumy = (snake) =>
  isSnake(getSnakeHead(snake).x, getSnakeHead(snake).y, getSnakeTail(snake));
# leanpub-end-insert

...

# leanpub-start-insert
const applyGameOver = (prevState) => ({
  playground: {
    isGameOver: true
  },
});
# leanpub-end-insert

...

class App extends Component {
  ...

  onTick = () => {
# leanpub-start-insert
    getIsSnakeOutside(this.state.snake) || getIsSnakeClumy(this.state.snake)
      ? this.setState(applyGameOver)
      : this.setState(applySnakePosition);
# leanpub-end-insert
  }

}
~~~~~~~~

- visualize when the snake hit the wall

{title="Editor: src/App.css",lang="css"}
~~~~~~~~
...

.grid-cell-hit {
  background-color: red;
}
~~~~~~~~

{title="Editor: src/App.js",lang="javascript"}
~~~~~~~~
# leanpub-start-insert
const getCellCs = (isGameOver, snake, snack, x, y) =>
# leanpub-end-insert
  cs(
    'grid-cell',
    {
      'grid-cell-border': 'grid-cell-border': isBorder(x, y),
      'grid-cell-snake': isSnake(x, y, snake.coordinates),
      'grid-cell-snack': isPosition(x, y, snack.coordinate.x, snack.coordinate.y),
# leanpub-start-insert
      'grid-cell-hit': isGameOver && isPosition(x, y, getSnakeHead(snake).x, getSnakeHead(snake).y),
# leanpub-end-insert
    }
  );

class App extends Component {
  ...

  render() {
    const {
      snake,
      snack,
# leanpub-start-insert
      playground,
# leanpub-end-insert
    } = this.state;

    return (
      <div className="app">
        <h1>Snake!</h1>
        <Grid
          snake={snake}
          snack={snack}
# leanpub-start-insert
          isGameOver={playground.isGameOver}
# leanpub-end-insert
        />
      </div>
    );
  }
}

# leanpub-start-insert
const Grid = ({ isGameOver, snake, snack }) =>
# leanpub-end-insert
  <div>
    {GRID.map(y =>
      <Row
        y={y}
        key={y}
        snake={snake}
        snack={snack}
# leanpub-start-insert
        isGameOver={isGameOver}
# leanpub-end-insert
      />
    )}
  </div>

# leanpub-start-insert
const Row = ({ isGameOver, snake, snack, y }) =>
# leanpub-end-insert
  <div className="grid-row">
    {GRID.map(x =>
      <Cell
        x={x}
        y={y}
        key={x}
        snake={snake}
        snack={snack}
# leanpub-start-insert
        isGameOver={isGameOver}
# leanpub-end-insert
      />
    )}
  </div>

# leanpub-start-insert
const Cell = ({ isGameOver, snake, snack, x, y }) =>
  <div className={getCellCs(isGameOver, snake, snack, x, y)} />
# leanpub-end-insert
~~~~~~~~
