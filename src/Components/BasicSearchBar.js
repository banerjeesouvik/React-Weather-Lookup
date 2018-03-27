import React, { Component } from 'react';

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
  
  export default Search;