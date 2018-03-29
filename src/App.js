import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import GetQueryParameterByName from './getQueryparameter.js'
import WeatherApp from './Components/weatherApp.js'
import './App.css'

class App extends Component {
  render() {
    const HomePageRouter = ({history}) => {
      let lat = this.props.lat;
      let lng = this.props.lng;
      //console.log(history);
      history.push(`/places/params?lat=${lat}&lng=${lng}`);
      return <div></div>
    }

    const RenderLocation = ({ match, history }) => {
      let latLng = [];
      latLng.push(GetQueryParameterByName('lat'));
      latLng.push(GetQueryParameterByName('lng'));
      console.log(latLng[0], this.props.lat, latLng[1], this.props.lng)
      if(this.props.lat.toString() !== latLng[0] && this.props.lng.toString() !== latLng[1]){
        this.props.dispatch({type:'CHANGE_LOCATION', lat : latLng[0], lng: latLng[1], weatherDisplayType: 'today'});
        console.log('triggered')
      }
      if (latLng.length === 2) {
        return <WeatherApp history={history} /*latlng={latLng}*//>
      } else {
        return <HomePageRouter />
      }
    }

    return (
      <Router>
        <div>
          <Route exact path='/' component={HomePageRouter} />
          <Route path='/places/:params' component={RenderLocation} />
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(App)
