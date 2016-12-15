import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import pic_map from '../assets/images/IDR664.gif';
import styles from '../scss/components/_weather.scss';
import pic_radar1 from '../assets/images/IDR664.T.201612062300.png'
import pic_radar2 from '../assets/images/IDR664.T.201612062306.png'
import pic_radar3 from '../assets/images/IDR664.T.201612062312.png'
import pic_radar4 from '../assets/images/IDR664.T.201612062318.png'
import pic_radar5 from '../assets/images/IDR664.T.201612062324.png'
// Import each of the images in the images folder.
// const requireAll = (r) => {
//   r.keys().forEach(r)
// };
// requireAll(
//   require.context(
//     "./assets/images",
//     true,
//     /.(jpg|JPG|png)/
//   )
// );
class Weather extends Component {
  constructor(props) {
    super(props);
    const pic_radar = [pic_radar1, pic_radar2, pic_radar3, pic_radar4, pic_radar5];
    this.state = {
      index: 0,
      picRadar: pic_radar,
      time:""
    };
    this.getRadarImages = this.getRadarImages.bind(this);
    this.getRadarImages();
    setInterval(() => {
      this.getRadarImages();
    }, 360000)
  }

  getRadarImages() {
    $.ajax({
      type: 'GET',
      url: `http://jafoteng.co/api/weather-images`,
      dataType: 'json',
      success: (res) => {
        if (res.status === 0) {
        } else {
          // console.log(res);
          const images = res.map((element) => {
            const url = element.split('"');
            console.log(url[1]);
            return url[1];
          });
          this.setState({
            picRadar: images
          });
        }
      },
      error: (err) => {
        console.log("Error ", err);
      }
    });
  }

  componentDidMount() {
    const that = this;
    this.updateImages = setInterval(function () {
      let temp = that.state.index + 1;
      if (temp > that.state.picRadar.length - 1) {
        temp = 0;
      }
      const time = that.state.picRadar[temp].split('.')[that.state.picRadar[temp].split('.').length-2];
      const hour = time.substring(time.length-4, time.length-2);
      const minute = time.substring(time.length-2);
      const test = new Date();
      // test.setUTCFullYear(2016, 11, 12);
      test.setUTCHours(Number(hour),Number(minute));

      console.log(test);
      that.setState({
        index: temp,
        time: test
      });
    }, 500);
  }


  componentWillUnmount() {
    clearInterval(this.updateImages);
  }

  render() {
    return (
      <div className={classnames(this.props.className)}>
        <div className={classnames(styles.weather)} style={{
          position: 'relative',
          height: '90vh',
          backgroundImage: 'url("http://ws.cdn.bom.gov.au/products/radar_transparencies/IDR.legend.0.png")'
        }}>
          <img className={classnames(styles.radar)} src={this.state.picRadar[this.state.index]} alt="hello"/>
          <div className={styles.weather} style={{
            zIndex: -3,
            backgroundImage: 'url("http://ws.cdn.bom.gov.au/products/radar_transparencies/IDR664.background.png")'
          }}></div>
          <div className={styles.weather} style={{
            zIndex: 7,
            backgroundImage: 'url("http://ws.cdn.bom.gov.au/products/radar_transparencies/IDR664.locations.png")'
          }}></div>
          <div className={styles.weather} style={{
            zIndex: 2,
            backgroundImage: 'url("http://ws.cdn.bom.gov.au/products/radar_transparencies/IDR664.range.png")'
          }}></div>
          <div className={styles.weather} style={{
            zIndex: -2,
            backgroundImage: 'url("http://ws.cdn.bom.gov.au/products/radar_transparencies/IDR664.topography.png")'
          }}></div>
        </div>
        <h4>{this.state.time !== "" ? this.state.time.toTimeString() : ''}</h4>
      </div>
    );
  }
}

Weather.propTypes = {};
Weather.defaultProps = {};

export default Weather;
