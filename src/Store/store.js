import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

const reducer = function (state, action) {
    switch (action.type) {
      case 'CHANGE_LOCATION':
        return { ...state, lat: action.lat, lng: action.lng, weatherDisplayType: action.weatherDisplayType };
      case 'CHANGE_WEATHER_TYPE':
        return { ...state, weatherDisplayType: action.weatherDisplayType }
      case 'FETCH_WEATHER_START':
        return { ...state, isDataFetched : action.isDataFetched}
      case 'FETCH_DONE':
        return { ...state, isDataFetched : action.isDataFetched, currentWeather : action.currentWeather , 
        weatherForecast : action.weatherForecast}
      default:
        return { ...state }
    }
}
const middleWare = applyMiddleware(thunk);
  
const store = createStore(reducer, {
    lat: 12.970000,
    lng: 77.589996,
    weatherDisplayType: 'today',
    isDataFetched : false,
    currentWeather: {},
    weatherForecast: {},
    },window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), middleWare)


export default store;