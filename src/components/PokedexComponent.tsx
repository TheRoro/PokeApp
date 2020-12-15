import React from 'react';

const TOTAL_POKEMON = 898;

type ListProps = {
  pokemon: any,
}

const PokemonList: React.FC<ListProps> = ({
  pokemon
}) => {
  const numbers = pokemon;
  const totalPkmn = TOTAL_POKEMON;
  const listItems = numbers.map((poke: any, index: any) =>
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
 return(
  <div>
    <ul>{listItems}</ul>
  </div>
)};

type State = {
  isLoaded: boolean,
  pokemon: any[],
  pokemon2: any[],
  pokemonFinal: any[],
  apiUrl: string,
  apiUrl2: string,
}

type Props = {
  type1: string,
  type2: string
}

class Pokedex extends React.Component<Props,State> {
  state: State = {
    isLoaded: false,
    pokemon: [],
    pokemon2: [],
    pokemonFinal: [],
    apiUrl: 'https://pokeapi.co/api/v2/type/' + this.props.type1,
    apiUrl2: 'https://pokeapi.co/api/v2/type/' + this.props.type2,
  };
  
  
  componentDidMount() {
    var apiUrl = 'https://pokeapi.co/api/v2/type/' + this.props.type1;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        this.setState((state) => ({
          isLoaded: true,
          pokemon: data.pokemon
        }));

        console.log('This is your data', data.pokemon)
      });
    if (this.props.type2 !== '') {
      var apiUrl2 = 'https://pokeapi.co/api/v2/type/' + this.props.type2;
      fetch(apiUrl2)
        .then((response) => response.json())
        .then((data) => {
          this.setState((state) => ({
            isLoaded: true,
            pokemon2: data.pokemon
          }));

          console.log('This is your data', this.state.pokemon2)
        });
    }
  }
  componentDidUpdate() {
    var apiUrl = 'https://pokeapi.co/api/v2/type/' + this.props.type1;
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
    const type1 = props.type1.charAt(0).toUpperCase() + props.type1.slice(1);
    const type2 = props.type2.charAt(0).toUpperCase() + props.type2.slice(1);
    return(
      <div>
        <h1>{type1 + ' Type:'}</h1>
        <h1>{type2 + ' Type:'}</h1>
        <PokemonList pokemon={state.pokemon}/>
      </div>
    );
  }
}
export default Pokedex;