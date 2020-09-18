import React, { Component } from 'react';
import { Table, Pagination, Button, Dialog, Message, Input, Icon, MenuButton } from '@alifd/next';
import { FormattedMessage } from 'react-intl';
import IceContainer from '@icedesign/container';
import { iot as iotApi } from '../../../../api';
import styles from './index.module.scss';
import DeviceInfoDialog from '../DeviceInfoDialog';

export default class TrashTable extends Component {
  state = {
    current: 1,
    pageSize: 10,
    total: 0,
    isLoading: true,
    data: [],
    dialogVisible: false,
    dialogDeviceId: undefined,
  };

  componentDidMount() {
    this.fetchData().catch(console.error);
  }

  fetchData = async () => {
    this.setState({ isLoading: true });
    const { current, pageSize } = this.state;
    this.setState({ isLoading: true });
    const response = await iotApi.list({ pageSize, pageNo: current });
    this.setState({
      total: response.data.total,
      data: response.data.data,
      isLoading: false,
    });
  };

  handlePaginationChange = (current) => {
    this.setState(
      {
        current,
      },
      () => {
        this.fetchData().catch(console.error);
      }
    );
  };

  handleDetail = async (deviceId) => {
    this.setState({
      dialogVisible: true,
      dialogDeviceId: deviceId,
    });
  };

  handleControl = (deviceId, ctrl) => {
    Dialog.confirm({
      title: '设备控制',
      content: ctrl === 1 ? `确认启动设备 ${deviceId}` : `确认停止设备${deviceId}`,
      onOk: async () => {
        const data = await iotApi.control({
          deviceId,
          ctrl,
        });

        if (data) {
          Message.success('操作成功!');
          this.fetchData().catch(console.error);
        }
      },
    });
  };

  handleSendingAscii = (deviceId) => {
    Dialog.confirm({
      title: '发送文本信息',
      content: (
        <Input
          placeholder="请输出消息: "
          onChange={val => this.setState({ message: val })}
        />),
      onOk: async () => {
        const { message } = this.state;
        const data = await iotApi.ascii({ deviceId, data: message });
        if (data) {
          Message.success('Message sent!');
        }
      },
    });
  };

  handleDelete = (deviceId) => {
    Dialog.confirm({
      title: '确认删除?',
      content: '确认删除?',
      onOk: async () => {
        const data = await iotApi.deletion(deviceId);
        if (data) {
          Message.success('Device deleted!');
        }
      },
    });
  };

  renderBit = (value) => {
    if (value === undefined || value === null) {
      return '未知';
    }
    return (
      ['低电平', '高电平'][value]
    );
  };

  renderStatus = (status) => {
    if (status === 'NORMAL') {
      return (<Icon type="success" style={{ color: '#1DC11D' }} />);
    } else if (status === 'LOST') {
      return (<Icon type="warning" style={{ color: '#FFA003' }} />);
    } else if (status === 'DISCONNECTED') {
      return (<Icon type="error" style={{ color: '#FF3333' }} />);
    }
    return (<Icon type="loading" />);
  };

  renderOperations = (deviceId) => {
    return (
      <div>
        <Button
          type="primary"
          style={{ marginRight: '5px' }}
          onClick={() => this.handleDetail(deviceId).catch(console.error)}
        >
          <FormattedMessage id="app.btn.detail" />
        </Button>
        <Button.Group>
          <Button
            type="secondary"
            onClick={() => this.handleControl(deviceId, 1)}
          >
            <FormattedMessage id="app.btn.startup" />
          </Button>
          <Button
            type="normal"
            warning
            onClick={() => this.handleControl(deviceId, 0)}
          >
            <FormattedMessage id="app.btn.shutdown" />
          </Button>
        </Button.Group>
        <MenuButton label="更多...">
          <MenuButton.Item
            style={{ marginLeft: '5px' }}
            onClick={() => this.handleSendingAscii(deviceId)}
          >
            <FormattedMessage id="app.btn.message" />
          </MenuButton.Item>
          <MenuButton.Item
            style={{ marginLeft: '5px' }}
            onClick={() => this.handleDelete(deviceId)}
          >
            <FormattedMessage id="app.btn.delete" />
          </MenuButton.Item>
        </MenuButton>
      </div>
    );
  };

  render() {
    const { current, total, isLoading, data } = this.state;

    return (
      <IceContainer>
        <Table loading={isLoading} dataSource={data} hasBorder={false}>
          <Table.Column title="设备ID" dataIndex="deviceId" />
          <Table.Column title="状态" dataIndex="status" cell={this.renderStatus} />
          <Table.Column
            title="基站信息(lac, ci)"
            cell={(value, index, record) => {
              if (record.lac === undefined || record.lac === null) {
                return '-';
              }
              return `${record.lac}, ${record.ci}`;
            }}
          />
          <Table.Column title="输入端状态" dataIndex="inputStat" cell={this.renderBit} />
          <Table.Column title="输出端状态" dataIndex="outputStat" cell={this.renderBit} />
          <Table.Column title="ICCID" dataIndex="iccId" cell={v => (v === undefined || v === null ? '-' : v)} />
          <Table.Column
            title="操作"
            width={400}
            dataIndex="deviceId"
            cell={this.renderOperations}
          />
        </Table>
        <Pagination
          className={styles.pagination}
          current={current}
          total={total}
          onChange={this.handlePaginationChange}
        />
        <DeviceInfoDialog
          visible={this.state.dialogVisible}
          onClose={() => this.setState({ dialogVisible: false })}
          deviceId={this.state.dialogDeviceId}
        />
      </IceContainer>
    );
  }
}

