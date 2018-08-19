import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import './App.css';

const t = 1000 / 30;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      style: {}
    };

    this.count = 0;
    this.center = [NaN, NaN];
    this.isDrawing = false;
    this.initRotate = 0;

    this.rotate = 0;
    this.rotateTime = 0;
    this.rotateVelocity = .01;

  }

  componentDidMount() {
    this.intervalHandler = setInterval(this.frame, t);

    const rects = findDOMNode(this.refs.app).getBoundingClientRect();
    this.center = [rects.width / 2, 350];
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandler);
  }

  frame = () => {
    this.count++;

    if (!this.isDrawing) {
      const lap = 2 * Math.PI;
      const a = this.rotateVelocity * .05;
      const s = (this.rotateVelocity * t - 1 / 2 * a * (t ^ 2));
      const rotate = this.rotate + s;
      this.rotate = rotate > lap ? rotate - lap : rotate;
      this.rotateVelocity = this.rotateVelocity - a;
    }

    this.setState({
      style: {
        transform: `rotate(${this.rotate}rad)`
      }
    });
  };

  getAbstractRotate(mx, my) {
    const [cx, cy] = this.center;
    let rotate = Math.atan((my - cy) / (mx - cx));
    return (mx - cx < 0 ? rotate + Math.PI * 1.5 : rotate + Math.PI * .5);
  }

  onMouseMove = event => {
    console.log('onMouseMove');
    if (this.isDrawing) {
      const previousRotate = this.rotate;
      const previousRotateTime = this.rotateTime;

      this.rotate = this.initRotate + this.getAbstractRotate(event.clientX, event.clientY);
      this.rotateTime = Date.now();

      console.log('this.rotate - previousRotate, this.rotateTime - previousRotateTime', this.rotate - previousRotate, this.rotateTime - previousRotateTime);
      this.rotateVelocity = (this.rotate - previousRotate) / (this.rotateTime - previousRotateTime);
    }
  };

  onMouseUp = event => {
    console.log('onMouseUp');
    this.isDrawing = false;
  };

  onMouseDown = event => {
    console.log('onMouseDown');
    this.isDrawing = true;
    this.initRotate = this.rotate - this.getAbstractRotate(event.clientX, event.clientY);
  };

  render() {
    return (
      <div className="App" ref="app" onMouseUp={ this.onMouseUp } onMouseMove={ this.onMouseMove }>
        <div className="logo" ref="logo" style={ this.state.style } onMouseDown={ this.onMouseDown }/>
      </div>
    );
  }
}

export default App;
