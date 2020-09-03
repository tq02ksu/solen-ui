import React, { Component } from 'react';
import moment from 'moment';
import { Balloon, Table, Pagination, Button, Dialog, Message, Input, Icon, MenuButton } from '@alifd/next';
import { FormattedMessage } from 'react-intl';
import IceContainer from '@icedesign/container';
import { iot as iotApi } from '../../../../api';
import styles from './index.module.scss';

export default class TrashTable extends Component {
  state = {
    current: 1,
    pageSize: 10,
    total: 0,
    isLoading: true,
    data: [],
  };

  componentDidMount() {
    this.fetchData().catch(console.error);
  }

  fetchData = async () => {
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
    const response = await iotApi.detail(deviceId);
    Dialog.show({
      title: '设备详细信息',
      content: (
        <div>
          <h3>基本信息</h3>
          <Table dataSource={[response.data]} size="small">
            <Table.Column title="信号强度" dataIndex="rssi" />
            <Table.Column title="电压(V)" dataIndex="voltage" />
            <Table.Column title="温度(°C)" dataIndex="temperature" />
            <Table.Column title="重力" dataIndex="gravity" />
            <Table.Column
              title="运行时间"
              dataIndex="uptime"
              cell={(value) => (
                <Balloon
                  closable={false}
                  trigger={moment.duration(value, 'seconds').humanize()}
                >
                  {value} 秒
                </Balloon>
              )}
            />
          </Table>
          <div style={response.data.reports ? {} : { display: 'none' }}>
            <h3>收到的消息</h3>
            <Table dataSource={response.data.reports} size="small">
              <Table.Column
                title="时间"
                dataIndex="time"
                width={100}
                cell={
                  (value) => {
                    return (
                      <Balloon
                        closable={false}
                        trigger={moment(value).fromNow()}
                      >
                        {value}
                      </Balloon>
                    );
                  }
                }
              />
              <Table.Column
                title="内容"
                dataIndex="content"
              />
            </Table>
          </div>
        </div>
      ),
      footerActions: ['ok'],
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
            type="normal"
            style={{ marginLeft: '5px' }}
            onClick={() => this.handleSendingAscii(deviceId)}
          >
            <FormattedMessage id="app.btn.message" />
          </MenuButton.Item>
          <MenuButton.Item
            style={{ marginLeft: '5px' }}
            warning
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
          <Table.Column
            title="坐标(北纬, 东经)"
            cell={(value, index, record) => {
              if (record.northLat === undefined || record.northLat === null) {
                return '-';
              }
              return `${record.northLat}, ${record.eastLong}`;
            }}
          />
          <Table.Column title="IMEI" dataIndex="iccId" cell={v => (v === undefined || v === null ? '-' : v)} />
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
      </IceContainer>
    );
  }
}

