import React, { Component } from 'react';
import TrashOverview from './components/TrashOverview';
import TrashList from './components/TrashTable';

export default class Trash extends Component {
  render() {
    return (
      <div>
        <TrashOverview />
        <TrashList />
      </div>
    );
  }
}
