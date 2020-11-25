import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DeviceDetail from '../DeviceDetail';
import ContainerTitle from '../../../../components/ContainerTitle';

export default withRouter(
  class DeviceDetailPage extends Component {
    render() {
      return (
        <div>
          <ContainerTitle
            links={[{ to: '/device/list', text: '设备列表' }]}
            title={`设备: ${this.props.match.params.deviceId}`}
          />
          <div style={{ margin: 20 }}>
            <DeviceDetail deviceId={this.props.match.params.deviceId} />
          </div>
        </div>
      );
    }
  },
);
