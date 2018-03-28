import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './Components/header.js';
import SearchBar from './Components/Searchbar.js';
import Weather from './Components/weather.js';
import GetQueryParameterByName from './getQueryparameter.js'
import './App.css';

class App extends Component{
    render(){
      const HomePageRouter = () => {
          window.location.href='/places/params?lat=12.970000&lng=77.589996';
      }
      const RenderLocation = ({match}) => {
        //console.log(match);
        let latLng=[];
        latLng.push(GetQueryParameterByName('lat'));
        latLng.push(GetQueryParameterByName('lng'));
        if(latLng.length === 2){
          return <WeatherApp latlng={latLng} />
        }else{
          return <HomePageRouter />
        }
      }
        return(
          <Router>
            <div>
            <Route exact path='/' component={HomePageRouter} />
            <Route path = '/places/:params' component={RenderLocation} />
            </div>
          </Router>
        )
    }
}

class WeatherApp extends Component {
  constructor(props){
    super(props);
    this.state = {
      lat : this.props.latlng[0],
      lon : this.props.latlng[1]
    }
    this.updateLngLat = this.updateLngLat.bind(this);
  }
  
  updateLngLat(latLng){
    //console.log('app received',lngLat);
    //this.setState({lat: lngLat.lat, lon : lngLat.lng});
    window.location.href = `/places/params?lat=${latLng.lat}&lng=${latLng.lng}`;
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.lngLat.lng !== null && nextProps.lngLat.lat !== null){
     // console.log('triggered');
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


export default App;
