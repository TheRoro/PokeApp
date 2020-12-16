import React from 'react';
import Button from 'react-bootstrap/Button';

type Handle = React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>;

type State = {
  type1: string,
  type2: string
}

type Props = {
  onSelectType: any,
}

const options = [
  {
    label: "None",
    value: "",
  },
  {
    label: "Bug",
    value: "bug",
  },
  {
    label: "Dark",
    value: "dark",
  },
  {
    label: "Dragon",
    value: "dragon",
  },
  {
    label: "Electric",
    value: "electric",
  },
  {
    label: "Fairy",
    value: "fairy",
  },
  {
    label: "Fighting",
    value: "fighting",
  },
  {
    label: "Fire",
    value: "fire",
  },
  {
    label: "Flying",
    value: "flying",
  },
  {
    label: "Ghost",
    value: "ghost",
  },
  {
    label: "Grass",
    value: "grass",
  },
  {
    label: "Ground",
    value: "ground",
  },
  {
    label: "Ice",
    value: "ice",
  },
  {
    label: "Normal",
    value: "normal",
  },
  {
    label: "Poison",
    value: "poison",
  },
  {
    label: "Psychic",
    value: "psychic",
  },
  {
    label: "Rock",
    value: "rock",
  },
  {
    label: "Steel",
    value: "steel",
  },
  {
    label: "Water",
    value: "water",
  }
];

class Type extends React.Component<Props,State> {
    state: State = {
      type1: 'fire',
      type2: 'fighting'
    };
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Pokemon Type:
            <select value={this.state.type1} onChange={this.handleChange}>
            {options.map((option, index) => (
              <option value={option.value} key={index}>{option.label}</option>
            ))}
            </select>
            <select value={this.state.type2} onChange={this.handleChange2}>
            {options.map((option, index) => (
              <option value={option.value} key={index}>{option.label}</option>
            ))}
            </select>
            <Button variant="primary" type="submit">Search</Button>
          </label>
        </form>
      );
    }
    handleChange = (event: Handle) => {
      this.setState((state) => ({
        type1: event.target.value.toLowerCase()
      }));
    }
    handleChange2 = (event: Handle) => {
      this.setState((state) => ({
        type2: event.target.value.toLowerCase()
      }));
    }
    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      this.handleTypeChange();
    }
    handleTypeChange = () => {
        var type1 = this.state.type1;
        var type2 = this.state.type2;
        this.props.onSelectType(type1, type2);      
    }
  }

export default Type;