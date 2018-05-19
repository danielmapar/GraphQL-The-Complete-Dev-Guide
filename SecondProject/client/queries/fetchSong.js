import gql from 'graphql-tag';

// The ! infront of ID means that the field is obligatory
export default gql`
  query SongQuery($id: ID!) {
    song(id: $id) {
      id
      title
      lyrics {
        id
        content,
        likes
      }
    }
  }
`;
