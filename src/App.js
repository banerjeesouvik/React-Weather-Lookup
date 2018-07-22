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
      history.push(`/places/params?lat=${lat}&lng=${lng}`);
      return <div></div>
    }

    const RenderLocation = ({ match, history }) => {
      let latLng = [];
      latLng.push(GetQueryParameterByName('lat'));
      latLng.push(GetQueryParameterByName('lng'));
      
      if (latLng.length === 2) {
        return <WeatherApp history={history} latLng={latLng}/>
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
  return {
    lat : state.lat,
    lng : state.lng
  }
}

export default connect(mapStateToProps)(App)
