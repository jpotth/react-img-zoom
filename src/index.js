/* eslint jsx-a11y/mouse-events-have-key-events: 0 */
import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import styles from './style.css'

const ZOOM_EVENT_TYPES = {
  HOVER: "hover",
  CLICK: "click"
};

class Zoom extends Component {
  constructor (props) {
    super(props)

    this.state = {
      zoom: false,
      zoomEvent: ZOOM_EVENT_TYPES.HOVER,
      mouseX: null,
      mouseY: null,
      imageLoaded: false
    }

    const {
      height,
      transitionTime,
      width,
    } = props

    this.outerDivStyle = {
      height: `${height}px`,
      width: `${width}px`,
      overflow: 'hidden',
    }

    this.innerDivStyle = {
      height: `${height}px`,
      transition: `transform ${transitionTime}s ease-out`,
    }

    this.imageRef = createRef()

    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
    this.handleMouseMovement = this.handleMouseMovement.bind(this)
    this.handleOnImageLoad = this.handleOnImageLoad.bind(this)
  }

  handleMouseOver () {
    this.setState({
      zoom: true,
    })
  }

  handleMouseOut () {
    this.setState({
      zoom: false,
    })
  }

  handleMouseMovement (e) {
    const {
      left: offsetLeft,
      top: offsetTop,
    } = this.imageRef.current.getBoundingClientRect()

    const {
      current: {
        style: {
          height,
          width,
        },
      },
    } = this.imageRef

    const x = ((e.pageX - offsetLeft) / parseInt(width, 10)) * 100
    const y = ((e.pageY - offsetTop) / parseInt(height, 10)) * 100

    this.setState({
      mouseX: x,
      mouseY: y,
    })
  }

  handleOnImageLoad() {
    this.setState{(imageLoaded: true});
  }

  renderLoadingDiv() {
    if(this.props.loadingDiv) {
      return this.props.loadingDiv;
    } else {
      return <div />;
    }
  }

  render () {
    const {
      mouseX,
      mouseY,
      zoom,
    } = this.state

    const {
      img,
      zoomScale,
    } = this.props

    const transform = {
      transformOrigin: `${mouseX}% ${mouseY}%`,
    }

    return (
      <div
        style={this.outerDivStyle}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onMouseMove={this.handleMouseMovement}
        ref={this.imageRef}
      >
        {!this.state.imageLoaded && this.renderLoadingDiv()}
        <img
          src={img}
          style={{
            ...transform,
            ...this.innerDivStyle,
            transform: zoom ? `scale(${zoomScale})` : 'scale(1.0)',
          }}
          className={styles.zoomImg}
          onLoad={this.props.onLoad}
        />
      </div>
    )
  }
}

Zoom.propTypes = {
  /** The path to the image. It can be a url. */
  img: PropTypes.string.isRequired,
  /** The zoom scale. */
  zoomScale: PropTypes.number.isRequired,
  /** The event that triggers a zoom effet. */
  zoomEvent: PropTypes.string,
  /** The maximum zoom scale. */
  maxZoomScale: PropTypes.number,
  /** The height of the image in pixels */
  height: PropTypes.number.isRequired,
  /** The width of the image in pixels */
  width: PropTypes.number.isRequired,
  /** The time (in seconds) that will take to scale your image. */
  transitionTime: PropTypes.number,
}

Zoom.defaultProps = {
  zoomEvent: "hover",
  maxZoomScale: 2,
  transitionTime: 0.1
}

export default Zoom
