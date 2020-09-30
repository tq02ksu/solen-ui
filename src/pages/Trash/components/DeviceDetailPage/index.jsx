import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import IceContainer from '@icedesign/container';
import DeviceDetail from '../DeviceDetail';

export default withRouter(class DeviceDetailPage extends Component {

  render() {
    return (
      <IceContainer>
        <div style={{ margin: 20 }}>
          <DeviceDetail deviceId={this.props.match.params.deviceId} />
        </div>
      </IceContainer>
    );
  }
});
