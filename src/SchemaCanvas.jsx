import React from 'react';


class SchemaCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.state = {
      matrix: props.matrix,
      context: null,
    };
    this.paint = this.paint.bind(this);
  }

  getMetrics() {
    const m = this.state.matrix;
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
      i * m[0][0] + j * m[0][1] + k * m[0][2],
      i * m[1][0] + j * m[1][1] + k * m[1][2],
    ]);
    const x = points.map(([x, y]) => x);
    const y = points.map(([x, y]) => y);
    return [
      Math.min.apply(Math, x),
      Math.min.apply(Math, y),
      Math.max.apply(Math, x),
      Math.max.apply(Math, y),
    ];
  }

  getSize() {
    const [x0, y0, x1, y1] = this.getMetrics();
    return [x1 - x0 + 100, y1 - y0 + 100];
  }

  componentDidMount() {
    const context = this.canvas.current.getContext('2d');
    const [x0, y0] = this.getMetrics();
    context.setTransform(1, 0, 0, 1, 50 - x0, 50 - y0);
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
      context.clearRect(0, 0, 100, 100);
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
    const [width, height] = this.getSize();
    return (
      <canvas ref={this.canvas} width={width} height={height} style={{
        border: '1px solid black',
        width: `${width}px`,
        height: `${height}px`,
      }}></canvas>
    );
  }
}


export default SchemaCanvas;
