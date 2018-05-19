import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';
import query from '../queries/fetchSongs';

class SongList extends Component {

  onSongDelete(id) {
    this.props.mutate({
      variables: {
        id
      }
    }).then(() => this.props.data.refetch());
    // refetch will re-execute any refetch
    // associated to the SongList component
  }

  renderSongs() {
    if (this.props.data.loading) return (<div>Loading...</div>);
    return this.props.data.songs.map(({id, title}, key) => {
      return (
        <li key={key} className="collection-item">
          <Link to={`/songs/${id}`}>
            {title}
          </Link>
          <i className="material-icons"
          onClick={() => this.onSongDelete(id)}>delete</i>
        </li>
      );
    })
  }
  render() {

    return (
      <div>
        <ul className="collection">
          {this.renderSongs()}
        </ul>
        <Link to="/songs/new" className="btn-floating btn-large red right">
          <i className="material-icons">add</i>
        </Link>
      </div>);
  }
}

const mutation = gql`
  mutation DeleteSong($id: ID) {
    deleteSong(id: $id) {
      id
    }
  }
`

// The query will be issued as soon as the component rendered on the screen
// As soon as it is complete, it will inject as props
export default graphql(mutation)(graphql(query)(SongList));
