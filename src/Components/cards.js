import React, { Component } from 'react'
import { connect } from 'react-redux'

class Cards extends Component {
  constructor() {
    super();
    this.state = {
      cityList: []
    }
  }

  removeHistory = (index) => {
    console.log('clicked')
    this.props.dispatch({ type: 'REMOVE_HISTORY', idx: index });
  }

  render() {
    let i = -1;
    let cardList = this.props.cityList.length > 0 ?
      this.props.cityList.map((city) => {
        return (
          <div key = {i} className='cards'>
            <div className = 'card-loc-icon'></div>
            <div className='card-wrapper'>
              <div className='card-name-btn-wrapper'>
                <div className='card-city-name'>{city.name}</div>
                <div className='close-btn' onClick={() => { this.removeHistory(++i) }}>X</div>
              </div>
              <div className='card-temp-hum-wrapper'>
                <div className='temp-icon'></div>
                <div className='card-city-temp'>{city.temp}&deg;C</div>
                <div className='humidity-icon'></div>
                <div className='card-city-hum'>{city.hum}</div>
              </div>
            </div>
          </div>
        )
      }) : undefined;
    return (
      <div className='card-list'>
        {cardList}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(Cards)
