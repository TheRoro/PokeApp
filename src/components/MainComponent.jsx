import React from 'react';
import Pokedex from './PokedexComponent'
import Type from './Type'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'water'
    };

    this.toggleChildMenu = this.toggleChildMenu.bind(this);
 }
  toggleChildMenu(newType) {
    this.setState(state => ({
      type: newType
    }));
  }
  handleType = (type) => {
      this.setState(state => ({
        type: type
      }));
  }
  render() {
    return (
      <div>
          <h1>Hello Pokemon world</h1>
          <Type onSelectType = {this.toggleChildMenu}/>
          <h1>{this.state.type}</h1>
          <Pokedex type={this.state.type}/>
      </div>
    );
  }
}

export default Main;
