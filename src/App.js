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
    this.update = this.update.bind(this);
  }
  update(cityInfo){
    //console.log('triggered with', cityName)
    this.setState({city:cityInfo.name, lat : cityInfo.lat, lon : cityInfo.lon});
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

class Header extends Component {
  constructor(){
    super();
    this.state = {
      heading : 'Weather'
    }
  }
  render(){
    return (
      <div className='heading'>{this.state.heading}</div>
    )
  }
}

class Search extends Component {
  constructor(){
    super();
    this.state = {
      city : '',
      isResult: false,
      result:''
    }
    this.update = this.update.bind(this);
  }
  update(event){
    const scope = this;
    var cityName = event.target.value;
    //console.log(event.keyCode)
    if(cityName.length > 0){
      fetch(`http://localhost:8080/weather?loc=${cityName}`)
        .then(response => response.json())
        .then(response => {
          //console.log(response);
          scope.setState({
            city : cityName,
            isResult: true,
            result: response.RESULTS.slice(0,5)
          })
          //console.log(this.state.isResult)
        })
    }
  }
  sendCity = () => {
    let cityInfo = this.state.result.map(function(city){
      return {
        name : city.name,
        lat : city.lat,
        lon : city.lon
      }
    });
    cityInfo = cityInfo.find(city => {
      return city.name === this.state.city;
    });
    this.props.updateParent(cityInfo)
  }
  render(){
    var res = this.state.isResult ? <SearchResult res={this.state.result}/> : undefined;
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
  render(){
    return (
      <div className='nav-bar'>
        <div className='nav-bar-elm' onClick={() => this.props.day('today')}>Today</div>
        <div className='nav-bar-elm' onClick={() => this.props.day('tomorrow')}>Tomorrow</div>
      </div>
    )
  }
}

class Weather extends Component {
  constructor(){
    super();
    this.state = {
      weatherInfo : [],
      isDataFetched : false,
      day : ''
    }
    this.updateDay = this.updateDay.bind(this);
  }
  updateDay(clickedDay){
    this.setState({day : clickedDay});
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.city.city !== this.props.city.city){
      //console.log(nextProps.city)
      fetch(`http://api.wunderground.com/api/3b051654317f7634/forecast/q/${nextProps.city.lat},${nextProps.city.lon}.json`)
        .then(response => response.json())
        .then(response => {
          //console.log(response);
          this.setState({weatherInfo : response, isDataFetched : true})
        })
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    return this.state.day !== nextState.day || this.props.city.city !== nextProps.city.city;
  }
  componentDidMount(){
      fetch(`http://api.wunderground.com/api/3b051654317f7634/conditions/q/${this.props.city.lat},${this.props.city.lon}.json`)
        .then(response => response.json())
        .then(response => {
          this.setState({weatherInfo : response, isDataFetched : true, day : 'today'})
        })
  }
  componentWillUpdate(){
    console.log(this.state.day)
    if(this.state.day === 'today'){
      fetch(`http://api.wunderground.com/api/3b051654317f7634/conditions/q/${this.props.city.lat},${this.props.city.lon}.json`)
        .then(response => response.json())
        .then(response => {
          this.setState({weatherInfo : response})
        })
    }else if(this.state.day === 'tomorrow'){
      fetch(`http://api.wunderground.com/api/3b051654317f7634/forecast/q/${this.props.city.lat},${this.props.city.lon}.json`)
        .then(response => response.json())
        .then(response => {
          this.setState({weatherInfo : response})
        })
    }
  }
  render(){
    let data = this.state.weatherInfo;
    console.log(data)
    if(this.state.isDataFetched) {
      if(this.state.day === 'today'){
        return(
          <div>
            <div className='city-info'>
              <div className='city'>City : {data.current_observation.display_location.city}</div>
              <div className='state'>State : {data.current_observation.display_location.state}</div>
              <div className='country'>Country : {data.current_observation.display_location.state_name}</div>
            </div>
            <Navbar day={this.updateDay}/>
            <div className='weather-info'>
              <div className='weather-type'>
                <div className='weather'>Weather : {data.current_observation.weather}</div>
                <img className='weather-img' src={data.current_observation.icon_url} alt={data.current_observation.icon}></img>
              </div>
              <div className='temp'>Temperature : {data.current_observation.temp_c}&deg; C</div>
            </div>
          </div>
        )
      }else{
        return(
          <div>
            <Navbar day={this.updateDay}/>
            <div className='weather-info'>
              <div className='weather-type'>
                <div className='weather'>Weather : {data.simpleforecast.forecastday[2].conditions}</div>
                <img className='weather-img' src={data.forecast.forecastday[2].icon_url} alt={data.forecast.forecastday[2].icon}></img>
              </div>
              <div className='temp'>High Temperature : {data.simpleforecast.forecastday[2].high.celsius}&deg; C</div>
              <div className='temp'>Low Temperature : {data.simpleforecast.forecastday[2].low.celsius}&deg; C</div>
            </div>
          </div>
        )
      }
    }else {
      return (
        <div className='weather-info'>
          <div className='loading'></div>
        </div>
      )
    }
  }
}
export default App;
