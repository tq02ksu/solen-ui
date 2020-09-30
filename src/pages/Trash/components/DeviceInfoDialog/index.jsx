import React, { Component } from 'react';
import { Dialog } from '@alifd/next';
import PropTypes from 'prop-types';
import DeviceDetail from '../DeviceDetail';

export default class DeviceInfoDialog extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    deviceId: PropTypes.string,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    deviceId: undefined,
  };

  render() {
    const { visible, onClose } = this.props;
    return (
      <Dialog
        title="设备详细信息"
        footerActions={['ok']}
        onOk={onClose}
        onClose={onClose}
        visible={visible}
        shouldUpdatePosition
      >
        <div style={{ width: 680 }}>
          <DeviceDetail deviceId={this.props.deviceId} />
        </div>
      </Dialog>
    );
  }
}
