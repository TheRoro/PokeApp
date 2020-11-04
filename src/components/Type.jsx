import React from 'react';
class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value.toLowerCase()});
    }
  
    handleSubmit(event) {
      event.preventDefault();
      this.handleTypeChange();
    }
    handleTypeChange = () => {
        var type = this.state.value;
        this.props.onSelectType(type);      
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Pokemon Type:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }

export default NameForm