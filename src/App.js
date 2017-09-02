import React, { Component } from 'react';
import cs from 'classnames';

import './App.css';

const GRID_SIZE = 35;
const GRID = [];

for (let i = 0; i <= GRID_SIZE; i++) {
  GRID.push(i);
}

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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
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