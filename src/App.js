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

const getCellCs = (x, y) =>
  cs(
    'grid-cell',
    {
      'grid-cell-border': isBorder(x, y),
    }
  );

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
  <div className={getCellCs(x, y)} />

export default App;