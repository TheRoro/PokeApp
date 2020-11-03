import React from 'react';

function PokemonList(props) {
  const numbers = props.pokemon;
  const listItems = numbers.map((poke, index) =>
    <li key={index}>
      {poke.pokemon.name}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}
class myComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      pokemon: []
    };
  }
  componentDidMount() {
    const apiUrl = 'https://pokeapi.co/api/v2/type/ground';
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          isLoaded: true,
          pokemon: data.pokemon
        });
        console.log('This is your data', data.pokemon)
      });
  }
  render() {
    const state = this.state;
    return(
      <div>
        <PokemonList pokemon={state.pokemon}/>
      </div>
    );
  }
}
export default myComponent;