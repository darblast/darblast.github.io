import React from 'react';


class ProjectionSchema extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.state = {
      matrix: props.matrix,
      metrics: this.getMetrics(props.matrix),
      context: null,
    };
    this.paint = this.paint.bind(this);
  }

  getMetrics(matrix) {
    const points = [
      [0, 0, 0],
      [0, 0, 1],
      [0, 1, 0],
      [0, 1, 1],
      [1, 0, 0],
      [1, 0, 1],
      [1, 1, 0],
      [1, 1, 1],
    ].map(([i, j, k]) => [
      i * matrix[0][0] + j * matrix[0][1] + k * matrix[0][2],
      i * matrix[1][0] + j * matrix[1][1] + k * matrix[1][2],
    ]);
    const x = points.map(([x, y]) => x);
    const y = points.map(([x, y]) => y);
    const x0 = Math.min.apply(Math, x);
    const y0 = Math.min.apply(Math, y);
    const x1 = Math.max.apply(Math, x);
    const y1 = Math.max.apply(Math, y);
    const width = x1 - x0 + 101;
    const height = y1 - y0 + 101;
    return {x0, y0, x1, y1, width, height};
  }

  componentDidMount() {
    const context = this.canvas.current.getContext('2d');
    context.setTransform(1, 0, 0, 1, 75, 75);
    context.fillStyle = '#FFFFFF';
    this.setState({context});
    window.requestAnimationFrame(this.paint);
  }

  componentWillUnmount() {
    this.setState({
      context: null,
    });
  }

  drawAxis(i, j, k) {
    const {matrix, context} = this.state;
    context.moveTo(0, 0);
    const x = i * matrix[0][0] + j * matrix[0][1] + k * matrix[0][2];
    const y = i * matrix[1][0] + j * matrix[1][1] + k * matrix[1][2];
    const m = y / x;
    if (y > x) {
      if (x && (m >= -1) && (m <= 1)) {
        context.lineTo(-75, y * -75 / x);
      } else {
        context.lineTo(x * 75 / y, 75);
      }
    } else {
      if (x && (m >= -1) && (m <= 1)) {
        context.lineTo(75, y * 75 / x);
      } else {
        context.lineTo(x * -75 / y, -75);
      }
    }
  }

  drawLine(i0, j0, k0, i1, j1, k1) {
    const {matrix, context} = this.state;
    context.moveTo(
        i0 * matrix[0][0] + j0 * matrix[0][1] + k0 * matrix[0][2],
        i0 * matrix[1][0] + j0 * matrix[1][1] + k0 * matrix[1][2]);
    context.lineTo(
        i1 * matrix[0][0] + j1 * matrix[0][1] + k1 * matrix[0][2],
        i1 * matrix[1][0] + j1 * matrix[1][1] + k1 * matrix[1][2]);
  }

  paint() {
    const context = this.state.context;
    if (context) {
      context.fillRect(-75, -75, 150, 150);
      context.lineWidth = 1;
      this.drawAxis(1, 0, 0);
      this.drawAxis(0, 1, 0);
      this.drawAxis(0, 0, 1);
      context.stroke();
      context.lineWidth = 0.5;
      this.drawLine(0, 0, 0, 1, 0, 0);
      this.drawLine(0, 0, 0, 0, 1, 0);
      this.drawLine(1, 0, 0, 1, 1, 0);
      this.drawLine(0, 1, 0, 1, 1, 0);
      this.drawLine(0, 0, 1, 1, 0, 1);
      this.drawLine(0, 0, 1, 0, 1, 1);
      this.drawLine(1, 0, 1, 1, 1, 1);
      this.drawLine(0, 1, 1, 1, 1, 1);
      this.drawLine(0, 0, 0, 0, 0, 1);
      this.drawLine(1, 0, 0, 1, 0, 1);
      this.drawLine(0, 1, 0, 0, 1, 1);
      this.drawLine(1, 1, 0, 1, 1, 1);
      context.stroke();
      // window.requestAnimationFrame(this.paint);
    }
  }

  render() {
    return (
      <canvas ref={this.canvas} width="150" height="150" style={{
        border: '1px solid black',
        width: `150px`,
        height: `150px`,
      }}></canvas>
    );
  }
}


export default ProjectionSchema;
