import React, { Component } from 'react';
import OverviewChart from '../ProjectList/components/OverviewChart';
import ProjectTable from '../ProjectList/components/ProjectTable';

export default class WashingMachine extends Component {
  render() {
    return (
      <div>
        <OverviewChart />
        <ProjectTable />
      </div>
    );
  }
}
