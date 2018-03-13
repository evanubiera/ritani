import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

var SearchBar = React.createClass({
  propTypes: {
    filterText: PropTypes.string,
    onUserInput: PropTypes.func
  },

  getInitialState: function() {
    return { filterText: '' }
  },

  handleChange: function(e) {
    this.props.onUserInput(
      this.refs.filterTextInput.value
    );
  },

  render: function () {
    return (
        <input
          name="filterText"
          type="text"
          placeholder="Search..."
          ref="filterTextInput"
          value={this.props.filterText}
          onChange={this.handleChange}
        />
    );
  }
})

var Results = React.createClass({
  propTypes: {
    searchList: PropTypes.array
  },

  render: function() {
    return (
      <ul>
        {this.props.searchList.map(function(user){
          return <li><img src={user.avatar_url} /><span>{user.login}</span></li>;
        })}
      </ul>
    )
  }
})

var Search = React.createClass({

  getInitialState: function() {
    return {
        filterText: '',
        searchResults: '',
        loadAll: false
      }
  },

  handleUserInput: function(filterText) {
    this.setState({
     filterText: filterText
    });
  },

  maybeRenderLoadMore: function() {
    if(this.state.searchResults.length>0) {
      return (
        <button id="toggleList" onClick={() => this.loadMore()}>
          Load More...
        </button>
      )
    }
  },

  renderResults: function() {
    var results = [];

    //conditionally load fist 5 or all using loadAll flag
    if(this.state.loadAll===true) {
      results = this.state.searchResults;
    } else {
      results = this.state.searchResults.slice(0, 5);
    }

    //render results to a div
    React.render(<Results searchList={results} />,
      document.getElementById('results'));
  },

  loadMore: function() {
    //if load more is on, load all 30 results
    this.setState({
      loadAll: !this.state.loadAll
    }, () => {
      if(this.state.loadAll===true) {
        document.getElementById('toggleList').innerHTML = "Load Less...";
      } else {
        document.getElementById('toggleList').innerHTML = "Load More...";
      }
      this.renderResults();
    });
  },

  callApi() {
    fetch('https://api.github.com/search/users?q=' + this.state.filterText)
    .then((result) => {
      // Get the result
      // If we want text, call result.text()
      return result.json();
    }).then((jsonResult) => {
      // Do something with the result
      console.log(jsonResult);

      this.setState({
        searchResults: jsonResult.items,
        loadAll: false
      });

      if(this.state.searchResults.length>0) {
        document.getElementById('toggleList').innerHTML = "Load More...";
        this.renderResults();
      } else {
        document.getElementById('results').innerHTML = "No results found";
      }
    })
  },

  render: function() {
    return (
      <div id="search">
        <SearchBar
            filterText={this.state.filterText}
            onUserInput={this.handleUserInput}
          />
          <br />
        <button onClick={() => this.callApi()}>
          Submit Search Term
        </button>
        <div id="error"></div>
        {this.maybeRenderLoadMore()}
        <div id="results"></div>
      </div>
    )
  }
})

React.render(<Search />, document.getElementById('app'));
