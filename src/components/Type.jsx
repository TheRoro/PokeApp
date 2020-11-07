import React from 'react';
import Button from 'react-bootstrap/Button';
class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        type1: '',
        type2: ''
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleChange2 = this.handleChange2.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({type1: event.target.value.toLowerCase()});
    }
    handleChange2(event) {
      this.setState({type2: event.target.value.toLowerCase()});
    }
  
    handleSubmit(event) {
      event.preventDefault();
      this.handleTypeChange();
    }
    handleTypeChange = () => {
        var type1 = this.state.type1;
        var type2 = this.state.type2;
        this.props.onSelectType(type1, type2);      
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Pokemon Type:
            <input type="text" value={this.state.type1} onChange={this.handleChange} />
            <input type="text" value={this.state.type2} onChange={this.handleChange2} />
            <select value={this.state.type1} onChange={this.handleChange}>
              <option value="bug">Bug</option>
              <option value="dark">Dark</option>
              <option value="dragon">Dragon</option>
              <option value="electric">Electric</option>
              <option value="fairy">Fairy</option>
              <option value="fairy">Fairy</option>
              <option value="grass">Grass</option>
              <option value="fire">fire</option>
              <option value="water">water</option>
              <option value="grass">grass</option>
            </select>
            <Button variant="primary">Primary</Button>
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }

export default NameForm