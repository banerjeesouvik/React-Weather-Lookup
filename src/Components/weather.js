import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature, Popup } from "react-mapbox-gl";
import { connect } from 'react-redux'

class Navbar extends Component {
  updateDay(day) {
    this.props.updateDay(day);
  }
  render() {
    let todaySelected = 'nav-bar-elm';
    let forecastSelected = 'nav-bar-elm';
    if (this.props.day === 'today') {
      todaySelected += ' selected-tab';
    } else {
      forecastSelected += ' selected-tab';
    }
    return (
      <div className='nav-bar'>
        <div className={todaySelected} onClick={() => this.updateDay('today')}>Current Weather</div>
        <div className={forecastSelected} onClick={() => this.updateDay('forecast')}>Forecast</div>
      </div>
    )
  }
}

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYmFuZXJqZWVzb3V2aWsiLCJhIjoiY2pmODB0ZWpwMGM0ZTJ3b2I4dDRrem1sNCJ9._ZHH4GBFaC44wMRgX7gXvA",
  injectCSS: false
});

const Today = (props) => {
  console.log(props)
  let date = props.weather.current_observation.observation_time_rfc822.split(' ').slice(0, 3).join(' ');
  let loc = props.weather.current_observation.display_location.city;
  let lat = props.weather.current_observation.display_location.latitude;
  let lon = props.weather.current_observation.display_location.longitude;
  let temp = props.weather.current_observation.temp_c;
  let hum = props.weather.current_observation.relative_humidity;
  return (
    <div>
      <div className='current-weather-wrapper'>
        <div className='wrapper-small'>
          <img className='weather-img' src={props.weather.current_observation.icon_url} alt={props.weather.current_observation.icon}></img>
          <div className='weather-date'>{date}</div>
          <div className='weather'><span className='val'>{props.weather.current_observation.weather}</span></div>
        </div>
        <div className='temp'><span className='val'>{temp}&deg;C</span>Temperature</div>
        <div className='humidity'><span className='val'>{hum}</span>Humidity</div>
      </div>
      <Map className='map'
        style="mapbox://styles/mapbox/streets-v9"
        center={[lon, lat]}
        containerStyle={{
          height: "50vh",
          width: "60vw"
        }}
        onClick={props.updateCordt}>
        <Layer
          type="symbol"
          id="marker"
          layout={{ "icon-image": "marker-15" }}>
          <Feature coordinates={[lon, lat]} />
        </Layer>
        <Popup
          coordinates={[lon, lat]}
          offset={{
            'bottom-left': [12, -38], 'bottom': [0, -38], 'bottom-right': [-12, -38]
          }}>
          <div className='inline-elm'><div className='location-icon'></div>{loc}</div><br />
          <div className='inline-elm'><div className='temp-icon'></div> {temp}<sup>&deg;</sup> C</div><br />
          <div className='inline-elm'><div className='humidity-icon'></div> {hum}</div>
        </Popup>
      </Map>
    </div>
  )
}

const Forecast = (props) => {
  //console.log(props.forecast_txt)
  return (
    <div className='forecast-wrapper'>
      <div className='forecast-day'>
        <span className='week-day'>{props.forecast.date.weekday_short},</span>
        <span className='month'>{props.forecast.date.monthname}</span>
        <span className='date'>{props.forecast.date.day},</span>
        <span className='year'>{props.forecast.date.year}</span>
      </div>
      <div className='forecast-type'>
        <div className='forecast-weather'>{props.forecast.conditions}</div>
        <img className='forecast-weather-img' src={props.forecast.icon_url} alt={props.forecast.icon}></img>
      </div>
      <div className='forecast-temp'>
        <b>(High) </b><span className='val'>{props.forecast.high.celsius}</span><sup> &deg;C</sup>
        <b> (Low) </b><span className='val'>{props.forecast.low.celsius}</span> <sup>&deg;C</sup>
      </div>
      <div className='forecast-humidity'>Humidity : <span className='val'>{props.forecast.avehumidity}</span><sup>%</sup></div>
      <div className='forecast-txt-wrapper'>
        <div className='txt'>Day : {props.forecast_txt[0]}</div>
        <div className='txt'>Night : {props.forecast_txt[1]}</div>
      </div>

    </div>
  )
}

class Weather extends Component {
  constructor() {
    super();
    this.state = {
      weatherInfo: [],
      forecast: [],
      isDataFetched: false,
      day: 'today'
    }
    this.updateDay = this.updateDay.bind(this);
    this.updateCoordinate = this.updateCoordinate.bind(this);
  }
  updateDay(val) {
    this.setState({ day: val });
  }
  componentWillReceiveProps(nextProps) {
      console.log(nextProps, 'nextProps')
    this.setState({ isDataFetched: false });
    //this.props.dispatch({type: 'FETCH_WEATHER_START', isDataFetched: false})
    console.log(typeof this.props.lng, typeof this.props.latLng[1])
    if (nextProps.latLng[0] !== nextProps.lat || nextProps.latLng[1] !== nextProps.lng) {
      fetch(`http://api.wunderground.com/api/3b051654317f7634/conditions/q/${this.props.latLng[0]},${this.props.latLng[1]}.json`)
        .then(response => response.json())
        .then(weatherInfo => {
          //console.log(response);
          fetch(`http://api.wunderground.com/api/3b051654317f7634/forecast/q/${this.props.latLng[0]},${this.props.latLng[1]}.json`)
            .then(response => response.json())
            .then(forecast => {
              this.setState({ weatherInfo: weatherInfo, forecast: forecast, isDataFetched: true, day: 'today' })
              this.props.dispatch({type:'CHANGE_LOCATION', lat : this.props.latLng[0], lng: this.props.latLng[1], isDataFetched : true,
              city : {name: weatherInfo.current_observation.display_location.city,
                      temp: weatherInfo.current_observation.temp_c,
                      hum: weatherInfo.current_observation.relative_humidity}
                    });
            })
        })
    }
    
  }
  componentDidMount() {
    console.log('Did Mount called')
    fetch(`http://api.wunderground.com/api/3b051654317f7634/conditions/q/${this.props.lat},${this.props.lng}.json`)
      .then(response => response.json())
      .then(weatherInfo => {
        //console.log(weatherInfo);
        fetch(`http://api.wunderground.com/api/3b051654317f7634/forecast/q/${this.props.lat},${this.props.lng}.json`)
          .then(response => response.json())
          .then(forecast => {
            //console.log(forecast);
            this.setState({ weatherInfo: weatherInfo, forecast: forecast, isDataFetched: true })
            if(this.props.lat.toString() !== this.props.latLng[0] && this.props.lng.toString() !== this.props.latLng[1]){
              this.props.dispatch({type:'CHANGE_LOCATION', lat : this.props.latLng[0], lng: this.props.latLng[1], isDataFetched:true,
              city : {name: weatherInfo.current_observation.display_location.city,
                      temp: weatherInfo.current_observation.temp_c,
                      hum: weatherInfo.current_observation.relative_humidity}
              });
              console.log('triggered')
            }
          })
      })
  }
  updateCoordinate(map, event) {
    //console.log('weather received', event.lngLat);
    this.props.updateCordt(event.lngLat);
  }
  render() {
    //console.log(this.props)
    console.log('rendered')
    let weather = this.state.weatherInfo;
    let forecast = this.state.forecast;
    let forecast_text = [];
    if (this.state.isDataFetched && forecast.response.error === undefined) {
      //console.log(forecast);
      let temp_forecast = forecast.forecast.txt_forecast.forecastday.slice(2, 8).map((val) => {
        return val.fcttext_metric;
      });
      //console.log(temp_forecast);
      let tmp = [];
      for (let i = 0; i < temp_forecast.length;) {
        tmp.push(temp_forecast.slice(i, i + 2));
        i = i + 2;
      }
      forecast_text = tmp;
      //console.log(tmp);
    }
    else if(this.state.isDataFetched){
      return <div className='invalid-query'>{forecast.response.error.description}</div>;
    }
    let display;
    if (this.state.day === 'today') {
      display = <Today weather={weather} updateCordt={this.updateCoordinate} />;
    } else if (this.state.day === 'forecast') {
      let i = -1;
      display = forecast.forecast.simpleforecast.forecastday.slice(1, 4).map((forcst) => {
        i++;
        return <Forecast key={forcst.date.weekday} forecast={forcst} forecast_txt={forecast_text[i]} />;
      });
    }
    if (this.state.isDataFetched) {
      return (
        <div className='weather-section'>
          <div className='city-info'>
            <div>City : <span className='city'>{weather.current_observation.display_location.city}</span></div>
            <div>State : <span className='state'>{weather.current_observation.display_location.state}</span></div>
            <div>Country : <span className='country'>{weather.current_observation.display_location.state_name}</span></div>
          </div>
          <Navbar updateDay={this.updateDay} day={this.state.day} />
          <div className='weather-info'>
            {display}
          </div>
        </div>
      )
    } else {
      return (
        <div className='loading'></div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(Weather)