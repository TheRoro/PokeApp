import React from 'react';

function PokemonList(props) {
  const numbers = props.pokemon;
  const totalPkmn = 898;
  const listItems = numbers.map((poke, index) =>
    <li key={index} className="poke-list">
      {poke.pokemon.url.substring(34, poke.pokemon.url.length - 1) < totalPkmn ? (
        <div>
          {poke.pokemon.name.charAt(0).toUpperCase() + poke.pokemon.name.slice(1)}
          <img className="poke-image" src={`https://pokeres.bastionbot.org/images/pokemon/${poke.pokemon.url.substring(34, poke.pokemon.url.length - 1)}.png`} alt={poke.pokemon.name}/>
          
          {/*<h1>{poke.pokemon.url.substring(34, poke.pokemon.url.length - 1)}</h1>*/}
        </div>
        ) : (
        <div>
             {/*MISSING IMAGES OF SPECIAL POKEMON (Megas, regionals, etc)*/}
        </div>
        )}
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
      pokemon: [],
      type: this.props.type,
      apiUrl: 'https://pokeapi.co/api/v2/type/' + this.props.type,
    };
  }
  componentDidMount() {
    var apiUrl = 'https://pokeapi.co/api/v2/type/' + this.props.type;
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
  componentDidUpdate() {
    var apiUrl = 'https://pokeapi.co/api/v2/type/' + this.props.type;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          isLoaded: true,
          pokemon: data.pokemon
        });
      });
  }
  render() {
    const state = this.state;
    const props = this.props;
    const type = props.type.charAt(0).toUpperCase() + props.type.slice(1);
    return(
      <div>
        <h1>{type + ' Type:'}</h1>
        <PokemonList pokemon={state.pokemon}/>
      </div>
    );
  }
}
export default myComponent;