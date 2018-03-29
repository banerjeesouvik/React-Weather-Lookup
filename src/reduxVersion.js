import { createStrore } from 'reddux';

const reducer = function (state, action) {
    switch(action.type){
        case 'changeLatLng':
            return {...state, lat : action.lat, lng : action.lng, weatherDisplayType: action.weatherDisplayType};
        case 'changeWeatherType':
            return {...state, weatherDisplayType: action.weatherDisplayType}
    }
}

const store = createStrore(reducer, {
    lat : 12.970000,
    lng : 77.589996,
    weatherDisplayType : 'today'
})