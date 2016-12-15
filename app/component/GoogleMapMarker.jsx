import React, {Component, PropTypes} from 'react';

class GoogleMapMarker extends Component {
  render() {
    return (
      <div style={{
        position: 'absolute',
        width: 50,
        height: 50,
        left: -50 / 2,
        top: -50 / 2,

        border: '5px solid #f44336',
        borderRadius: 50,
        backgroundColor: 'white',
        textAlign: 'center',
        color: '#3f51b5',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 4
      }}>
        {this.props.text}
      </div>
    );
  }
}

GoogleMapMarker.propTypes = {
  text: PropTypes.string
};
GoogleMapMarker.defaultProps = {};

export default GoogleMapMarker;
