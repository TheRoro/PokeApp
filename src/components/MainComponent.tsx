import React from 'react';
// import Type from './Type';
// import Calc from './Calculator2';
// import Pokedex from './PokedexComponent';
import Home from './HomeComponent';

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
        <Home/>
          {/* <h1 className="text-primary">PokeApp</h1>
          <Type onSelectType = {this.handleType}/>
          <Calc type1={this.state.type1} type2={this.state.type2}/> */}
          {/* <Calculator type1={this.state.type1} type2={this.state.type2}/> */}
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
