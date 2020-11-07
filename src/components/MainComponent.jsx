import React from 'react';
import Pokedex from './PokedexComponent'
import Type from './Type'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type1: 'fire',
      type2: 'fighting'
    };
 }
  handleType = (type1, type2) => {
      this.setState(state => ({
        type1: type1,
        type2: type2
      }));
  }
  render() {
    return (
      <div>
          <h1 className="text-primary">Hello Pokemon world</h1>
          <Type onSelectType = {this.handleType}/>
          <Pokedex type1={this.state.type1} type2={this.state.type2}/>
      </div>
    );
  }
}

export default Main;
