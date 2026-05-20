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
    // Normalize: treat spaces as dashes for matching (moves use dashes internally)
    const normalizedInput = userInput.toLowerCase().replace(/ /g, '-');
    //Initial value
    while(cont < size && i < options.length) {
      if(options[i].toLowerCase().indexOf(normalizedInput) === 0){
        filteredOptions.push(options[i]);
        cont++;
      }
      i++;
    }
    //Contains value
    i = 0;
    while(cont < size && i < options.length) {
      if(options[i].toLowerCase().indexOf(normalizedInput) !== 0 && 
        options[i].toLowerCase().indexOf(normalizedInput) > -1){
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

  // Format display name: replace hyphens with spaces for readability
  prettyName = (name) => {
    return name.replace(/-/g, ' ');
  };

  onClick = (e) => {
    const rawName = e.currentTarget.getAttribute('data-value');
    this.setState({
      activeOption: 0,
      filteredOptions: [],
      showOptions: false,
      userInput: this.prettyName(rawName),
      searching: true,
    });
    if(rawName)
      this.props.onChangeValue(rawName.toLowerCase(), 13);
    else
      this.props.onChangeValue(this.state.userInput, 13);
  };
  onKeyDown = (e) => {
    const { activeOption, filteredOptions } = this.state;

    if (e.keyCode === 13) {
      const selected = filteredOptions[activeOption];
      this.setState({
        activeOption: 0,
        showOptions: false,
        userInput: selected ? this.prettyName(selected) : this.state.userInput,
        searching: true,
      });
      if(selected)
        this.props.onChangeValue(selected, e.keyCode);
      else
        this.props.onChangeValue(this.state.userInput, e.keyCode);
    } else if (e.keyCode === 38) {
      if (activeOption === 0) {
        return;
      }
      this.setState({ 
        activeOption: activeOption - 1,
        userInput: this.prettyName(filteredOptions[activeOption - 1])
      });
    } else if (e.keyCode === 40) {
      if (activeOption === filteredOptions.length - 1) {
        return;
      }
      
      this.setState({
        activeOption: activeOption + 1,
        userInput: this.prettyName(filteredOptions[activeOption + 1])
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
                <li className={className} key={optionName} data-value={optionName} onClick={onClick}>
                  {this.prettyName(optionName)}
                </li>
              );
            })}
          </ul>
        );
      } else {
        optionList = (
          <div className="no-options">
            <p>No match found</p>
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
          <button className="search-btn" onClick={() => {
            this.setState({ showOptions: false, searching: true });
            if(this.state.userInput) {
              const apiName = this.state.userInput.replace(/ /g, '-');
              this.props.onChangeValue(apiName, 13);
            }
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        {optionList}
      </React.Fragment>
    );
  }
}

export default SearchEngine;
