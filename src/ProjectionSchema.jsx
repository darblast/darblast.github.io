import React from 'react';


class ProjectionSchema extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.grippers = {
      i: React.createRef(),
      j: React.createRef(),
      k: React.createRef(),
    };
    this.state = {
      context: null,
      dragging: {
        i: false,
        j: false,
        k: false,
      },
    };
    this.paint = this.paint.bind(this);
    this.drag = this.drag.bind(this);
  }

  componentDidMount() {
    const context = this.canvas.current.getContext('2d');
    context.setTransform(1, 0, 0, 1, 75, 75);
    context.fillStyle = '#FFFFFF';
    this.setState({context});
    window.requestAnimationFrame(this.paint);
  }

  componentDidUpdate() {
    const matrix = this.props.matrix;
    this.grippers.i.current.style.left = `${matrix[0][0] + 75}px`;
    this.grippers.i.current.style.top = `${matrix[1][0] + 75}px`;
    this.grippers.j.current.style.left = `${matrix[0][1] + 75}px`;
    this.grippers.j.current.style.top = `${matrix[1][1] + 75}px`;
    this.grippers.k.current.style.left = `${matrix[0][2] + 75}px`;
    this.grippers.k.current.style.top = `${matrix[1][2] + 75}px`;
  }

  componentWillUnmount() {
    this.setState({
      context: null,
    });
  }

  setIGripperDragging(dragging) {
    this.setState({
      dragging: {
        ...this.state.dragging,
        i: dragging,
      }
    });
  }

  setJGripperDragging(dragging) {
    this.setState({
      dragging: {
        ...this.state.dragging,
        j: dragging,
      }
    });
  }

  setKGripperDragging(dragging) {
    this.setState({
      dragging: {
        ...this.state.dragging,
        k: dragging,
      }
    });
  }

  drawAxis(i, j, k) {
    const matrix = this.props.matrix;
    const context = this.state.context;
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
    const matrix = this.props.matrix;
    const context = this.state.context;
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
      context.clearRect(-75, -75, 150, 150);
      context.beginPath();
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
      window.requestAnimationFrame(this.paint);
    }
  }

  drag(event) {
    // TODO
  }

  render() {
    return (
      <div onMouseMove={this.drag} style={{
        position: 'relative',
        width: '150px',
        height: '150px',
        overflow: 'hidden',
      }}>
        <canvas ref={this.canvas} width="150" height="150" style={{
          position: 'absolute',
          border: '1px solid black',
          width: `150px`,
          height: `150px`,
        }}></canvas>
        <div
          ref={this.grippers.i}
          onMouseDown={e => this.setIGripperDragging(true)}
          onMouseUp={e => this.setIGripperDragging(false)}
          style={{
            color: '#f00',
            position: 'absolute',
          }}
        ><i className="fas fa-circle" style={{
          margin: '-50% 0 0 -50%',
        }}></i></div>
        <div
          ref={this.grippers.j}
          onMouseDown={e => this.setJGripperDragging(true)}
          onMouseUp={e => this.setJGripperDragging(false)}
          style={{
            color: '#0f0',
            position: 'absolute',
          }}
        ><i className="fas fa-circle" style={{
          margin: '-50% 0 0 -50%',
        }}></i></div>
        <div
          ref={this.grippers.k}
          onMouseDown={e => this.setKGripperDragging(true)}
          onMouseUp={e => this.setKGripperDragging(false)}
          style={{
            color: '#00f',
            position: 'absolute',
          }}
        ><i className="fas fa-circle" style={{
          margin: '-50% 0 0 -50%',
        }}></i></div>
      </div>
    );
  }
}


export default ProjectionSchema;
