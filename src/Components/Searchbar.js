import React from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
 
class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: '' }
    this.onChange = (address) => this.setState({ address })
   // this.sendCity = this.sendCity.bind(this);
  }
 
  handleFormSubmit = (event) => {
    event.preventDefault();
    document.getElementsByClassName('search-input').value = '';
    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
          //this.sendCity(latLng);
          window.location.href = `/places/params?lat=${latLng.lat}&lng=${latLng.lng}`;
      })
      .catch(error => console.error('Error', error))
  }
  // sendCity = (latLng) => {
  //   //console.log(latLng)
  //   if(latLng !== undefined){
  //     this.props.updateParent(latLng);
  //   }
  // }
  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
      placeholder: 'Search Places...',
      onFocus : window.scrollTo(0,0)
    }
    const cssStyle = {
        root : 'search-root',
        input : 'search-input',
        autocompleteContainer : 'autocomplete-container',
    }
    return (
      <form onSubmit={this.handleFormSubmit}>
        <PlacesAutocomplete inputProps={inputProps} classNames={cssStyle}/>
        <button type="submit" className='btn'>Submit</button>
      </form>
    )
  }
}
 
export default SearchBar