import React, { Component } from 'react';
import { Table, Pagination, Button, Dialog, Message, Input } from '@alifd/next';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import IceContainer from '@icedesign/container';
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
    this.fetchData();
  }

  fetchData = () => {
    const { current, pageSize } = this.state;
    this.setState(
      {
        isLoading: true,
      },
      () => {
        axios({
          method: 'get',
          url: '/api/listAll',
        }).then(response => {
          const dat = response.data;
          this.setState({
            total: dat.length,
            data: dat.slice((current - 1) * pageSize, current * pageSize),
            isLoading: false,
          });
        });
      }
    );
  };

  handlePaginationChange = (current) => {
    this.setState(
      {
        current,
      },
      () => {
        this.fetchData();
      }
    );
  };

  handleDetail = (deviceId) => {
    return () => {
      axios.get(`/api/detail/${deviceId}`).then(response => {
        Dialog.show({
          title: `设备详细信息 ${deviceId}`,
          content: response.data.reports.map(report => {
            return <p content={report} />;
          }),
          footerActions: ['ok'],
        });
      });
    };
  };

  handleStartup = (deviceId) => {
    return () => {
      Dialog.confirm({
        title: '启动设备',
        content: `确认启动设备 ${deviceId}`,
        onOk: () => {
          return new Promise((resolve) => {
            axios.post('/api/sendControl', {
              deviceId,
              ctrl: 1,
            }).then((response) => {
              resolve();
              if (response.status === 200) {
                Message.success('Startup successfully !');
              } else {
                Message.error(`error, status is ${response.statusText}`);
              }
            });
          });
        },
      });
    };
  };

  handleShutdown = (deviceId) => {
    return () => {
      Dialog.confirm({
        title: '关闭设备',
        content: `确认关闭设备 ${deviceId}`,
        onOk: () => {
          return new Promise((resolve) => {
            axios.post('/api/sendControl', {
              deviceId,
              ctrl: 0,
            }).then((response) => {
              resolve();
              if (response.status === 200) {
                Message.success('Shutdown successfully !');
              } else {
                Message.error(`error, status is ${response.statusText}`);
              }
            });
          });
        },
      });
    };
  };

  handleSendingAscii = (deviceId) => {
    return () => {
      const inputOnChange = (val) => {
        this.setState({
          data: val,
        });
      };

      Dialog.confirm({
        title: '',
        content: <Input placeholder="请输出消息: " onChange={inputOnChange} />,
        onOk: () => {
          return new Promise((resolve) => {
            const { val } = this.state;
            axios.post('/api/sendAscii', {
              deviceId,
              data: val,
            }).then((response) => {
              resolve();
              if (response.status === 200) {
                Message.success('Message sent!');
              } else {
                Message.error(`error, status is ${response.statusText}`);
              }
            });
          });
        },
      });
    };
  };

  renderBit = (value) => {
    return (
      [<span>低电平</span>, <span>高电平</span>][value]
    );
  };

  renderStatus = (value) => {
    return (
      value.active ? <span>正常</span> : <span>已断开</span>
    );
  };

  renderOper = (deviceId) => {
    return (
      <div>
        <Button
          type="primary"
          style={{ marginRight: '5px' }}
          onClick={this.handleDetail(deviceId)}
        >
          <FormattedMessage id="app.btn.detail" />
        </Button>
        <Button.Group>
          <Button
            type="secondary"
            onClick={this.handleStartup(deviceId)}
          >
            <FormattedMessage id="app.btn.startup" />
          </Button>
          <Button
            type="normal"
            warning
            onClick={this.handleShutdown(deviceId)}
          >
            <FormattedMessage id="app.btn.shutdown" />
          </Button>
        </Button.Group>
        <Button
          type="normal"
          style={{ marginRight: '5px' }}
          onClick={this.handleSendingAscii(deviceId)}
        >
          <FormattedMessage id="app.btn.message" />
        </Button>
      </div>
    );
  };

  render() {
    const { current, total, isLoading, data } = this.state;

    return (
      <div style={styles.container}>
        <IceContainer>
          <Table loading={isLoading} dataSource={data} hasBorder={false}>
            <Table.Column title="设备ID" dataIndex="deviceId" />
            <Table.Column title="状态" dataIndex="channel" cell={this.renderStatus} />
            <Table.Column title="lac" dataIndex="lac" />
            <Table.Column title="ci" dataIndex="ci" />
            <Table.Column title="输入端状态" dataIndex="inputStat" cell={this.renderBit} />
            <Table.Column title="输出端状态" dataIndex="outputStat" cell={this.renderBit} />
            <Table.Column
              title="操作"
              width={400}
              dataIndex="deviceId"
              cell={this.renderOper}
            />
          </Table>
          <Pagination
            className={styles.pagination}
            current={current}
            total={total}
            onChange={this.handlePaginationChange}
          />
        </IceContainer>
      </div>
    );
  }
}

