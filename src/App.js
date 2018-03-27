import React, { Component } from 'react';
import SearchBar from './Components/Searchbar.js';
import Weather from './Components/weather.js';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';

class App extends Component{
  
    render(){
        return(
          <Router>
            <div>
            <Route exact path='/' component={WeatherApp} />
            </div>
          </Router>
        )
    }
}

class WeatherApp extends Component {
  constructor(){
    super();
    this.state = {
      lat : 12.970000,
      lon : 77.589996
    }
    this.updateLngLat = this.updateLngLat.bind(this);
  }
  
  updateLngLat(lngLat){
    //console.log('app received',lngLat);
    this.setState({lat: lngLat.lat, lon : lngLat.lng});
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.lngLat.lng !== null && nextProps.lngLat.lat !== null){
      console.log('triggered');
      this.setState({lat : nextProps.lngLat.lat, lon : nextProps.lngLat.lng});
    }
  }
  render() {
    //console.log(this.state.loc)
    return (
      <div>
        <div className='fixed-pos'>
          <Header />
          <SearchBar updateParent={this.updateLngLat}/>
        </div>
        <Weather city={this.state} updateCordt = {this.updateLngLat}/>
      </div>
    );
  }
}

const Header = () =>
      <div className='heading'>
        <div className='heading-logo'></div>
        Weather<span className='heading-last'>.app</span>
      </div>;






export default App;
