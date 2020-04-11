import React from 'react';


class SchemaCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.state = {
      context: null,
    };
    this.renderSchema = this.renderSchema.bind(this);
  }

  componentDidMount() {
    this.setState({
      context: this.canvas.current.getContext('2d'),
    });
    window.requestAnimationFrame(this.renderSchema);
  }

  componentWillUnmount() {
    this.setState({
      context: null,
    });
  }

  renderSchema() {
    const context = this.state.context;
    if (context) {
      context.clearRect(0, 0, 100, 100);
      // TODO
      window.requestAnimationFrame(this.renderSchema);
    }
  }

  render() {
    return (
      <canvas ref={this.canvas} width="100" height="100" style={{
        border: '1px solid black',
        width: '100px',
        height: '100px',
      }}></canvas>
    );
  }
}


export default SchemaCanvas;
