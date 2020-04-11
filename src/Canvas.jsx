import React from 'react';


class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  render() {
    return (
      <canvas style={{
        width: '100%',
        height: '100%',
      }} ref={this.canvas}></canvas>
    );
  }
}


export default Canvas;
