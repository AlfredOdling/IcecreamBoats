import React, { Component } from 'react';
import {
  Dimensions,
  View,
  PanResponder,
  StyleSheet
} from 'react-native';
import { Motion, spring } from 'react-motion';
import gstyles from '../style/styles';



const { width, height } = Dimensions.get('window');
const DEFAULT_CONTAINER_HEIGHT = 60;

export default class SlideDownView extends Component {
  constructor(props) {
    super(props);

    const {
      offsetTop, handlerHeight, initialHeight, containerMinimumHeight, containerMaximumHeight, containerBackgroundColor,
      containerOpacity, handlerDefaultView, handlerBackgroundColor, handlerOpacity
    } = props;

    this.state = {
      offsetTop: offsetTop != undefined ? offsetTop : DEFAULT_CONTAINER_HEIGHT,
      handlerHeight : handlerHeight != undefined ? handlerHeight: DEFAULT_CONTAINER_HEIGHT,
      containerHeight : initialHeight != undefined ? initialHeight: handlerHeight,
      previousContainerHeight: initialHeight != undefined ? initialHeight: handlerHeight,
      containerMinimumHeight : containerMinimumHeight != undefined ? containerMinimumHeight: DEFAULT_CONTAINER_HEIGHT,
      containerMaximumHeight : containerMaximumHeight != undefined ? containerMaximumHeight : 190,
      containerBackgroundColor : containerBackgroundColor != undefined ? containerBackgroundColor : '#FFFFFF',
      containerOpacity : containerOpacity != undefined ? containerOpacity : 1,
      handlerView : handlerDefaultView,
      handlerBackgroundColor : handlerBackgroundColor != undefined ? handlerBackgroundColor : '#FFFFFF',
      handlerOpacity : handlerOpacity != undefined ? handlerOpacity : 1,
      isPanMoving: false
    };

    // Sets motions' default style to be intial height so that it doesn't animate on first render
    // Container height must always start from handler height. That is the minimum height.
    this.previousContainerHeight = initialHeight > handlerHeight ? initialHeight : handlerHeight;
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this.handlePanResponderStart.bind(this),
      onPanResponderMove: this.handlePanResponderMove.bind(this),
      onPanResponderRelease: this.handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this.handlePanResponderEnd.bind(this)
      
    });
  }

  componentDidMount() {
    // Make sure that handlerView is set
    if (this.state.handlerView == undefined) {
      throw "Set a handler view. Hint: It is a React Class."
    }
  }

  setVisibleState(visible) {
    const { containerMaximumHeight, containerMinimumHeight } = this.state;
    const containerHeight = visible ? containerMaximumHeight : containerMinimumHeight;
    this.setState({ containerHeight });
  }

  render() {

    const styles = {
      container: {
        position: 'absolute',
        overflow: 'hidden',
        bottom: 0,
        opacity: this.state.containerOpacity,
        //backgroundColor : this.state.containerBackgroundColor,
        backgroundColor : 'rgba(52, 52, 52, 0)',
        height: this.state.containerHeight
      },
      handler: {
        height : this.state.handlerHeight,
        width : width,
        justifyContent : 'center',
        opacity : this.state.handlerOpacity,
        backgroundColor : 'rgba(52, 52, 52, 0)'
        //backgroundColor : this.state.containerBackgroundColor,
      }
    };

    var y;
    if (this.state.isPanMoving) {
      y = this.state.containerHeight;
    } else {
      y = spring(this.state.containerHeight, { stiffness: 200, damping: 30 });
    }
    return (
      <Motion defaultStyle={{y: this.state.previousContainerHeight}} style={{y: y}}>
        {
          ({y}) => (
            <View style={[styles.container, { height: y}]}>
              <View style={styles.handler} {...this.panResponder.panHandlers}>
                {this.state.handlerView}
              </View>
              {this.props.children}
            </View>
          )
        }
      </Motion>
    );
  }

  handlePanResponderStart(e, gestureState) {
    console.log('Start: '+gestureState.dy+' '+this.state.containerHeight);

    const dy = gestureState.dy;
    const negativeY = -dy;

    // Stores displacement in y-axis at touchStart
    this.previousTop = negativeY + this.state.containerHeight;
  }

  handlePanResponderMove(e, gestureState) {
    const dy = gestureState.dy;
    const negativeY = -dy;
  
    // current position is difference in distance since touchStart(dy) and displacement in y-axis at touchStart(dy)
    const newHeight = negativeY + this.previousTop;
    console.log('Move: '+newHeight);



    // This check is to prevent the handler from moving out of it's boundry
    if (newHeight >= this.state.containerMinimumHeight && newHeight <= this.state.containerMaximumHeight) {
      console.log('inside')
      //this.setState({ containerHeight : positionY, isPanMoving: true });

      var previousContainerHeight = this.state.containerHeight;
      this.setState({
        previousContainerHeight: previousContainerHeight, 
        containerHeight: newHeight, 
        isPanMoving: true
      });

      // This will call getContainerHeight of parent component.
      if (this.props.getContainerHeight != undefined) {
        this.props.getContainerHeight(this.state.containerHeight);
      }
    }
  }

  handlePanResponderEnd(e, gestureState) {
    console.log('End');

    let containerHeight;
    const dy = -gestureState.dy;

    // Saves current state of containerHeight so that it can be used to
    // travel off using <Motion/> from last point(this.previousContainerHeight)
    this.previousContainerHeight = this.state.containerHeight;

    if(this.previousTop == this.state.containerHeight) { // not moved
      if(this.state.containerHeight == this.state.containerMaximumHeight) {
        containerHeight = this.state.containerMinimumHeight;
        this.props.onSlideFinished(true);
      } else {
        containerHeight = this.state.containerMaximumHeight;
          this.props.onSlideFinished(false);
        }
    } else if (dy > 0) { // move up
      containerHeight = this.state.containerMaximumHeight;
      this.props.onSlideFinished(false);
    } else { // move down
      containerHeight = this.state.containerMinimumHeight;
      this.props.onSlideFinished(true);
    }

    this.setState({ containerHeight : containerHeight, isPanMoving: false });
    // This will call getContainerHeight of parent component.
    if (this.props.getContainerHeight != undefined) {
      this.props.getContainerHeight(containerHeight);
    }
  }
  

}
