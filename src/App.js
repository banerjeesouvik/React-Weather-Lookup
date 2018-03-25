import React, { Component } from 'react';
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
  }
  update(cityInfo){
    //console.log('triggered with', cityName)
    this.setState({city:cityInfo.name, lat : cityInfo.lat, lon : cityInfo.lon, day : 'today'});
  }

  render() {
    //console.log(this.state.loc)
    return (
      <div>
        <Header />
        <Search updateParent={this.update}/>
        <Weather city={this.state}/>
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
    console.log(this.state.result)
    let cityInfo = this.state.result.map(function(city){
      return {
        name : city.name,
        lat : city.lat,
        lon : city.lon
      }
    });
    console.log(cityInfo)
    cityInfo = cityInfo.find(city => {
      return city.name === this.state.city;
    });
    console.log(cityInfo);
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
            this.setState({weatherInfo : weatherInfo, forecast : forecast, isDataFetched : true})
          })
      })
  }

  render(){
    let weather = this.state.weatherInfo;
    let forecast = this.state.forecast;
    //console.log(forecast)
    let display;
    if(this.state.day === 'today'){
      display = <Today weather = {weather} />;
    }else if(this.state.day === 'forecast'){
      display = forecast.forecast.simpleforecast.forecastday.slice(1,4).map((forcst) => {
        return <Forecast key = {forcst.date.weekday} forecast = {forcst} />;
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

const Today = (props) => {
  return (
    <div className='current-weather-wrapper'>
      <div className='wrapper-small'>
        <img className='weather-img' src={props.weather.current_observation.icon_url} alt={props.weather.current_observation.icon}></img>
        <div className='weather'><span className='val'>{props.weather.current_observation.weather}</span></div>
      </div>
      <div className='temp'><span className='val'>{props.weather.current_observation.temp_c}&deg;C</span>Temperature</div>
      <div className='humidity'><span className='val'>{props.weather.current_observation.relative_humidity}</span>Humidity</div>
    </div>
  )
}

const Forecast = (props) => {
  return (
    <div className='forecast-wrapper'>
        <div className='forecast-day'>
          <span className='week-day'>{props.forecast.date.weekday_short},</span>
          <span className='month'>{props.forecast.date.monthname}</span>
          <span className='date'>{props.forecast.date.day},</span>
          <span className='year'>{props.forecast.date.year}</span>
        </div>
        <div className='forecast-type'>
           <div className='forecast-weather'>Weather : {props.forecast.conditions}</div>
           <img className='forecast-weather-img' src={props.forecast.icon_url} alt={props.forecast.icon}></img>
        </div>
        <div className='forecast-temp'>
            Temperature : <b>(High) </b>{props.forecast.high.celsius} &deg;C ,
                          <b> (Low) </b>{props.forecast.low.celsius} &deg;C
        </div>
        <div className='forecast-humidity'>Humidity : {props.forecast.avehumidity}%</div>
    </div>
  )
}
export default App;
