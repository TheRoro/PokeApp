import React from 'react';
import Type from './Type';
import Calc from '../Calculator';
// import Pokedex from './PokedexComponent';

type State = {
  type1: string,
  type2: string
}

type Props = {

}

class Main extends React.Component<Props,State> {
  state: State = {
    type1: 'fire',
    type2: 'fighting'
  };
  render() {
    return (
      <div className="main">
        <h1>Main</h1>
          <Type onSelectType = {this.handleType}/>
          <Calc type1={this.state.type1} type2={this.state.type2}/>
          {/* <Calculator type1={this.state.type1} type2={this.state.type2}/>
          {/* <Pokedex type1={this.state.type1} type2={this.state.type2}/> */}
      </div>
    );
  }
  handleType = (type1: string, type2: string) => {
    this.setState(state => ({
      type1: type1,
      type2: type2
    }));
}
}

export default Main;
