import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature, Popup } from "react-mapbox-gl";
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      city : 'Bangalore',
      lat : 12.970000,
      lon : 77.589996,
    }
    this.update = this.update.bind(this)
    this.updateLngLat = this.updateLngLat.bind(this);
  }
  update(cityInfo){
    //console.log('triggered with', cityName)
    this.setState({city:cityInfo.name, lat : cityInfo.lat, lon : cityInfo.lon, day : 'today'});
  }
  updateLngLat(lngLat){
    console.log('app received',lngLat);
  }

  render() {
    //console.log(this.state.loc)
    return (
      <div>
        <Header />
        <Search updateParent={this.update}/>
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

class Search extends Component {
  constructor(){
    super();
    this.state = {
      city : '',
      isResult: 'default',
      result:''
    }
    this.update = this.update.bind(this);
  }
  update(event){
    const scope = this;
    var cityName = event.target.value;
    //console.log(event.keyCode)
    if(cityName.length > 0){
      this.setState({isResult : 'loading'});
      fetch(`http://localhost:8080/weather?loc=${cityName}`)
        .then(response => response.json())
        .then(response => {
          //console.log(response);
          scope.setState({
            city : cityName,
            isResult: 'done',
            result: response.RESULTS.slice(0,5)
          })
          //console.log(this.state.isResult)
        })
    }
  }
  sendCity = () => {
    //console.log(this.state.result)
    let cityInfo = this.state.result.map(function(city){
      return {
        name : city.name,
        lat : city.lat,
        lon : city.lon
      }
    });
    //console.log(cityInfo)
    cityInfo = cityInfo.find(city => {
      return city.name === this.state.city;
    });
    //console.log(cityInfo);
    if(cityInfo !== undefined){
      this.props.updateParent(cityInfo);
    }
  }
  render(){
    var res = this.state.isResult === 'done' ? <SearchResult res={this.state.result}/> : (this.state.isResult === 'loading') ?
                <SuggestionLoad /> : undefined ;
    //console.log(this.state.isResult)
    return (
      <div className='search'>
        <input list='search-res' className='search-input' type='text' onChange={this.update} placeholder='City'></input>
        {res}
        <div className='btn' onClick={this.sendCity}>Submit</div>
      </div>
    )
  }
}
const SuggestionLoad = () => <div className = 'suggestion-load'></div>

class SearchResult extends Component {
  render() {
    let res = this.props.res;
    return (
      <div>
        <datalist id='search-res'>
        {res.map((item) => <option key={item.name}>{item.name}</option>)}
        </datalist>
      </div>
    )

  }
  updateState = (result) =>{
    this.setState({result});
  }
}

class Navbar extends Component {
  updateDay(day){
    this.props.updateDay(day);
  }
  render(){
    let todaySelected = 'nav-bar-elm';
    let forecastSelected = 'nav-bar-elm';
    if(this.props.day === 'today'){
      todaySelected += ' selected-tab';
    }else{
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

class Weather extends Component {
  constructor(){
    super();
    this.state = {
      weatherInfo : [],
      forecast : [],
      isDataFetched : false,
      day : 'today'
    }
    this.updateDay = this.updateDay.bind(this);
    this.updateCoordinate = this.updateCoordinate.bind(this);
  }
  updateDay(val){
    this.setState({day : val});
  }
  componentWillReceiveProps(nextProps){
    this.setState({isDataFetched : false});
    if (nextProps.city.city !== this.props.city.city){
      //console.log(nextProps.city)
      fetch(`http://api.wunderground.com/api/3b051654317f7634/conditions/q/${nextProps.city.lat},${nextProps.city.lon}.json`)
        .then(response => response.json())
        .then(weatherInfo => {
          //console.log(response);
          fetch(`http://api.wunderground.com/api/3b051654317f7634/forecast/q/${nextProps.city.lat},${nextProps.city.lon}.json`)
            .then(response => response.json())
            .then(forecast => {
              this.setState({weatherInfo : weatherInfo, forecast : forecast, isDataFetched : true, day: 'today'})
            })
        })
    }
  }
  componentDidMount(){
    fetch(`http://api.wunderground.com/api/3b051654317f7634/conditions/q/${this.props.city.lat},${this.props.city.lon}.json`)
      .then(response => response.json())
      .then(weatherInfo => {
        console.log(weatherInfo);
        fetch(`http://api.wunderground.com/api/3b051654317f7634/forecast/q/${this.props.city.lat},${this.props.city.lon}.json`)
          .then(response => response.json())
          .then(forecast => {
            //console.log(forecast);
            this.setState({weatherInfo : weatherInfo, forecast : forecast, isDataFetched : true})
          })
      })
  }
  updateCoordinate(map, event){
    console.log('weather received', event.lngLat);
    this.props.updateCordt(event.lngLat);
  }
  render(){
    let weather = this.state.weatherInfo;
    let forecast = this.state.forecast;
    //console.log(forecast)
    let forecast_text = [];
    if(this.state.isDataFetched){
      let temp_forecast = forecast.forecast.txt_forecast.forecastday.slice(2,8).map((val) => {
        return val.fcttext_metric;
      });
      //console.log(temp_forecast);
      let tmp = [];
      for(let i = 0; i < temp_forecast.length;){
        tmp.push(temp_forecast.slice(i,i+2));
        i= i+2;
      }
      forecast_text = tmp;
      //console.log(tmp);
    }
    let display;
    if(this.state.day === 'today'){
      display = <Today weather = {weather} updateCordt={this.updateCoordinate}/>;
    }else if(this.state.day === 'forecast'){
      let i = -1;
      display = forecast.forecast.simpleforecast.forecastday.slice(1,4).map((forcst) => {
        i++;
        return <Forecast key = {forcst.date.weekday} forecast = {forcst} forecast_txt = {forecast_text[i]}/>;
      });
    }
    if(this.state.isDataFetched) {
        return(
          <div>
            <div className='city-info'>
              <div>City : <span className='city'>{weather.current_observation.display_location.city}</span></div>
              <div>State : <span className='state'>{weather.current_observation.display_location.state}</span></div>
              <div>Country : <span className='country'>{weather.current_observation.display_location.state_name}</span></div>
            </div>
            <Navbar updateDay={this.updateDay} day={this.state.day}/>
              <div className='weather-info'>
                {display}
              </div>
          </div>
        )
      }else {
        return (
          <div className='weather-info'>
            <div className='loading'></div>
          </div>
        )
      }
  }
}

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYmFuZXJqZWVzb3V2aWsiLCJhIjoiY2pmODB0ZWpwMGM0ZTJ3b2I4dDRrem1sNCJ9._ZHH4GBFaC44wMRgX7gXvA",
  injectCSS : false
});

const Today = (props) => {
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
            center = {[lon, lat]}
            containerStyle={{
                height: "50vh",
                width: "60vw"
            }}
            onClick = {props.updateCordt}>
          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}>
            <Feature coordinates={[lon, lat]}/>
          </Layer>
          <Popup
            coordinates={[lon,lat]}
            offset={{
              'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
            }}>
            <div className='inline-elm'><div className='location-icon'></div>{loc}</div><br/>
            <div className='inline-elm'><div className='temp-icon'></div> {temp}<sup>&deg;</sup> C</div><br/>
            <div className='inline-elm'><div className='humidity-icon'></div> {hum}</div>
          </Popup>
        </Map>
      </div>
    )
}

const Forecast = (props) => {
  console.log(props.forecast_txt)
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
        <div className= 'forecast-txt-wrapper'>
            <div className='txt'>Day : {props.forecast_txt[0]}</div>
            <div className='txt'>Night : {props.forecast_txt[1]}</div>
        </div>

    </div>
  )
}
export default App;
