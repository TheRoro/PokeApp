import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SearchEngine.css';

export class SearchEngine extends Component {
  constructor(props) {
    super(props);
    this.state.userInput = this.props.val;
  }
  static propTypes = {
    options: PropTypes.instanceOf(Array).isRequired,
  };
  state = {
    activeOption: 0,
    filteredOptions: [],
    showOptions: false,
    userInput: '',
    searching: false,
  };

  onChange = (e) => {
    const { options } = this.props;
    const userInput = e.currentTarget.value;
    this.props.onChangeValue(userInput);
    const filteredOptions = [];
    var size = 10;
    let cont = 0;
    let i = 0;
    //Initial value
    while(cont < size && i < options.length) {
      if(options[i].toLowerCase().indexOf(userInput.toLowerCase()) === 0){
        filteredOptions.push(options[i]);
        cont++;
      }
      i++;
    }
    //Contains value
    i = 0;
    while(cont < size && i < options.length) {
      if(options[i].toLowerCase().indexOf(userInput.toLowerCase()) !== 0 && 
        options[i].toLowerCase().indexOf(userInput.toLowerCase()) > -1){
        filteredOptions.push(options[i]);
        cont++;
      }
      i++;
    }

    this.setState({
      activeOption: 0,
      filteredOptions,
      showOptions: true,
      userInput: e.currentTarget.value
    });
  };

  onClick = (e) => {
    this.setState({
      activeOption: 0,
      filteredOptions: [],
      showOptions: false,
      userInput: e.currentTarget.innerText,
      searching: true,
    });
    if(e.currentTarget.innerText.toLowerCase())
      this.props.onChangeValue(e.currentTarget.innerText.toLowerCase(), 13);
    else
      this.props.onChangeValue(this.state.userInput, 13);
  };
  onKeyDown = (e) => {
    const { activeOption, filteredOptions } = this.state;

    if (e.keyCode === 13) {
      this.setState({
        activeOption: 0,
        showOptions: false,
        userInput: filteredOptions[activeOption],
        searching: true,
      });
      if(filteredOptions[activeOption])
        this.props.onChangeValue(filteredOptions[activeOption], e.keyCode);
      else
        this.props.onChangeValue(this.state.userInput, e.keyCode);
    } else if (e.keyCode === 38) {
      if (activeOption === 0) {
        return;
      }
      this.setState({ 
        activeOption: activeOption - 1,
        userInput: filteredOptions[activeOption - 1]
      });
    } else if (e.keyCode === 40) {
      if (activeOption === filteredOptions.length - 1) {
        return;
      }
      
      this.setState({
        activeOption: activeOption + 1,
        userInput: filteredOptions[activeOption + 1]
      });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,

      state: { activeOption, filteredOptions, showOptions, userInput }
    } = this;
    let optionList;
    if (showOptions && userInput) {
      if (filteredOptions.length) {
        optionList = (
          <ul className="options">
            {filteredOptions.map((optionName, index) => {
              let className;
              if (index === filteredOptions.length - 1 && index === activeOption) {
                className = 'last-option option-active'
              }
              else if (index === activeOption) {
                className = 'option-active';
              }
              else if (index === filteredOptions.length - 1){
                className = 'last-option'
              }
              return (
                <li className={className} key={optionName} onClick={onClick}>
                  {optionName}
                </li>
              );
            })}
          </ul>
        );
      } else {
        optionList = (
          <div className="no-options">
            <p>No pokemon was found</p>
          </div>
        );
      }
    }
    return (
      <React.Fragment>
        <div className="search-div">
          { this.state.userInput === '' || 
          this.state.userInput === undefined ||
          this.state.filteredOptions.length === 0 ||
          this.state.searching === true ? 
          <input
            placeholder="Search"
            type="text"
            className="search-box-curved"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
          />
          :
          <input
            placeholder="Search"
            type="text"
            className="search-box"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
          />}
        </div>
        {optionList}
      </React.Fragment>
    );
  }
}

export default SearchEngine;
