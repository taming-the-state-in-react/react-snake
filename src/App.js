import React, { Component } from 'react';
import { connect } from 'react-redux';
import cs from 'classnames';

import './App.css';

var GRID_ARRAY = [];

for (var i = 0; i <= 50; i++) {
  GRID_ARRAY.push(i);
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    }
  }

  render() {
    const { snake, snack } = this.state;

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
