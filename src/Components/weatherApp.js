import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from './header.js'
import SearchBar from './Searchbar.js'
import Weather from './weather.js'

class WeatherApp extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     lat: this.props.latlng[0],
  //     lon: this.props.latlng[1]
  //   }
  //   this.updateLngLat = this.updateLngLat.bind(this);
  // }
  constructor() {
    super()
  }

  updateLngLat = (latLng) => {
    console.log(this.props, 'hist')
    //console.log(latLng)
    this.props.history.push(`/places/params?lat=${latLng.lat}&lng=${latLng.lng}`)
    //console.log(this.props)
    //window.location.href = `/places/params?lat=${latLng.lat}&lng=${latLng.lng}`;
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps, 'nextProps')
  //   if (nextProps.latlng[0] !== null && nextProps.latlng[1] !== null) {
  //     //this.setState({ lat: nextProps.latlng[0], lon: nextProps.latlng[1] });
  //   }
  // }
  
  render() {
    //console.log(this.state.loc)
    return (
      <div>
        <div className='fixed-pos'>
          <Header />
          <SearchBar updateParent={this.updateLngLat} />
        </div>
        <Weather /*city={this.state}*/ updateCordt={this.updateLngLat} />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(WeatherApp)