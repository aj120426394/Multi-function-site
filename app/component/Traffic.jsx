import React, {Component, PropTypes} from 'react';
import GoogleMap from 'google-map-react';
import Map from 'google-maps-react';
import classnames from 'classnames';
import GoogleMapMarker from './GoogleMapMarker';

class Traffic extends Component {
  constructor(props){
    super(props);
    this.initMap = this.initMap.bind(this);
  }

  initMap() {
    // const map = new google.maps.Map(document.getElementById('map'), {
    //   center: {lat: -34.397, lng: 150.644},
    //   scrollwheel: false,
    //   zoom: 8
    // });
  }

  componentDidMount() {
    // this.initMap();
  }

  render() {
    return (
      <div className={classnames(this.props.className)} style={{height: '90vh'}}>
        <GoogleMap
          defaultCenter={{lat: -27.722279, lng: 153.197939}}
          defaultZoom={11}
          bootstrapURLKeys={{
            key: 'AIzaSyD0CAO-Q7uPBctSh24OYofbjnxWI0IW2rw',
            language: 'en'
          }}
          layerTypes={['TrafficLayer', 'TransitLayer']}
        >
          <GoogleMapMarker lat={-27.553066} lng={153.054351} text={'GU'} />
        </GoogleMap>
      </div>
    );
  }
}

Traffic.propTypes = {};
Traffic.defaultProps = {};

export default Traffic;
