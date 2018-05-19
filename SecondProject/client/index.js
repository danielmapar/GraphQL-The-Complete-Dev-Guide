import './style/style.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import SongList from './components/SongList';
import SongCreate from './components/SongCreate';
import SongDetail from './components/SongDetail';
import App from './components/App'


// It will assume resources are available at /graphql endpoint
const client = new ApolloClient({
  // Apollo identifies objects queried and map those internally by id
  // This way whenever we run a mutation and we return the updated object (with id)
  // Apollo will re-render the view with the new data
  // This is an option, you can also do a refretchQueries inside the mutation (but that is an extra query)
  // This setup is a cache system and helps a lot
  // https://www.apollographql.com/docs/react/features/cache-updates.html
  dataIdFromObject: object => object.id
});

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App} >
          <IndexRoute component={SongList} />
          <Route path="songs/new" component={SongCreate} />
          <Route path="songs/:id" component={SongDetail} />
        </Route>
      </Router>
    </ApolloProvider>
  );
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
