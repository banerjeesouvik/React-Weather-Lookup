import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Search />
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
    this.setState({city : event.target.value})
    if(this.state.city.length > 0){
      fetch(`http://localhost:8080/weather?loc=${this.state.city}`)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          //SearchResult.update(response.RESULTS);
          console.log(scope)
          scope.setState({
            isResult: true,
            result: response.RESULTS
          })
          console.log(this.state.isResult)
        })
    }
  }
  render(){
    var div = this.state.isResult ? <SearchResult res={this.state.result}/> : undefined;
    console.log(this.state.isResult)
    return (
      <div className='search'>
        <input className='search-input' type='text' onChange={this.update} placeholder='City'></input>
        {div}
      </div>
    )
  }
}

class SearchResult extends Component {
  render() {
    let res = this.props.res;
    return (
      <div>
        {res.map((item) => <p>{item.name}</p>)}
      </div>
    )

  }
  updateState = (result) =>{
    this.setState({result});
  }
}
export default App;
