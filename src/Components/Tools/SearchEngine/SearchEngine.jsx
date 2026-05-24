import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatPokemonName, toPokemonApiSlug } from '../pokemonNames';
import './SearchEngine.css';

let nextSearchId = 0;

export class SearchEngine extends Component {
  constructor(props) {
    super(props);
    this.listboxId = `search-suggestions-${nextSearchId++}`;
    this.state = {
      activeOption: 0,
      filteredOptions: [],
      showOptions: false,
      userInput: this.props.val || '',
      searching: false,
    };
  }
  static propTypes = {
    options: PropTypes.instanceOf(Array).isRequired,
    onChangeValue: PropTypes.func.isRequired,
    label: PropTypes.string,
  };

  onChange = (e) => {
    const { options } = this.props;
    const userInput = e.currentTarget.value;
    this.props.onChangeValue(userInput);
    const filteredOptions = [];
    var size = 10;
    let cont = 0;
    let i = 0;
    const normalizedInput = toPokemonApiSlug(userInput);
    //Initial value
    while(cont < size && i < options.length) {
      if(toPokemonApiSlug(options[i]).indexOf(normalizedInput) === 0){
        filteredOptions.push(options[i]);
        cont++;
      }
      i++;
    }
    //Contains value
    i = 0;
    while(cont < size && i < options.length) {
      if(toPokemonApiSlug(options[i]).indexOf(normalizedInput) !== 0 &&
        toPokemonApiSlug(options[i]).indexOf(normalizedInput) > -1){
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

  prettyName = (name) => {
    return formatPokemonName(name);
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
      this.props.onChangeValue(toPokemonApiSlug(rawName), 13);
    else
      this.props.onChangeValue(this.state.userInput, 13);
  };
  onKeyDown = (e) => {
    const { activeOption, filteredOptions } = this.state;

    if (
      filteredOptions.length === 0 &&
      (e.key === 'ArrowUp' || e.key === 'ArrowDown')
    ) {
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredOptions[activeOption];
      this.setState({
        activeOption: 0,
        showOptions: false,
        userInput: selected ? this.prettyName(selected) : this.state.userInput,
        searching: true,
      });
      if(selected)
        this.props.onChangeValue(toPokemonApiSlug(selected), 13);
      else
        this.props.onChangeValue(this.state.userInput, 13);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeOption === 0) {
        return;
      }
      this.setState({ 
        activeOption: activeOption - 1,
        userInput: this.prettyName(filteredOptions[activeOption - 1])
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeOption === filteredOptions.length - 1) {
        return;
      }
      
      this.setState({
        activeOption: activeOption + 1,
        userInput: this.prettyName(filteredOptions[activeOption + 1])
      });
    } else if (e.key === 'Escape') {
      this.setState({ showOptions: false, activeOption: 0 });
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
          <ul className="options" id={this.listboxId} role="listbox">
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
                <li
                  id={`${this.listboxId}-${index}`}
                  className={className}
                  key={optionName}
                  data-value={optionName}
                  role="option"
                  aria-selected={index === activeOption}
                  onMouseDown={event => event.preventDefault()}
                  onClick={onClick}
                >
                  {this.prettyName(optionName)}
                </li>
              );
            })}
          </ul>
        );
      } else {
        optionList = (
          <div className="no-options" role="status">
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
            aria-label={this.props.label || 'Search'}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showOptions && filteredOptions.length > 0}
            aria-controls={showOptions && filteredOptions.length > 0 ? this.listboxId : undefined}
            aria-activedescendant={showOptions && filteredOptions.length > 0 ? `${this.listboxId}-${activeOption}` : undefined}
            placeholder="Search"
            type="text"
            className="search-box-curved"
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={() => this.setState({ showOptions: false })}
            value={userInput}
          />
          :
          <input
            aria-label={this.props.label || 'Search'}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showOptions && filteredOptions.length > 0}
            aria-controls={showOptions && filteredOptions.length > 0 ? this.listboxId : undefined}
            aria-activedescendant={showOptions && filteredOptions.length > 0 ? `${this.listboxId}-${activeOption}` : undefined}
            placeholder="Search"
            type="text"
            className="search-box"
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={() => this.setState({ showOptions: false })}
            value={userInput}
          />}
          <button type="button" className="search-btn" aria-label={this.props.label || 'Search'} onClick={() => {
            this.setState({ showOptions: false, searching: true });
            if(this.state.userInput) {
              const apiName = toPokemonApiSlug(this.state.userInput);
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
