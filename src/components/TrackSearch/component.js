import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TrackSearch.css';

class TrackSearch extends Component {
  state = {
    searchTerm: ''
  };

  updateSearchTerm = e => {
    this.setState({
      searchTerm: e.target.value
    });
  };

  render() {
    return (
      <div className="track-search-container">
        <form>
          <input
            onChange={this.updateSearchTerm}
            type="text"
            placeholder="Add youtube track by id..."
          />
          <button
            onClick={e => {
              e.preventDefault();
              this.props.addYoutubeSong(this.state.searchTerm);
              this.setState({ searchTerm: '' });
            }}
          >
            <i className="fa fa-search search" aria-hidden="true" />
          </button>
        </form>
      </div>
    );
  }
}

TrackSearch.propTypes = {
  searchSongs: PropTypes.func,
  token: PropTypes.string
};

export default TrackSearch;
