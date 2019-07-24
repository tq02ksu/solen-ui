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
      axios.get(`/api/device/${deviceId}`).then(response => {
        const items = response.data.reports.map(report => {
          return <li>{report.time}: {report.content}</li>;
        });
        Dialog.show({
          title: '设备详细信息',
          content:
            (
              <div>
                <p>{deviceId} 收到的消息：</p>
                <ul>{items}</ul>
              </div>
            ),
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
            }).then(() => {
              resolve();
              Message.success('Startup successfully !');
              this.fetchData();
            }).catch((error) => {
              resolve();
              Message.error(`error, status is ${error.response.statusText}`);
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
            }).then(() => {
              resolve();
              Message.success('Shutdown successfully !');
              this.fetchData();
            }).catch((error) => {
              resolve();
              Message.error(`error, status is ${error.response.statusText}`);
            });
          });
        },
      });
    };
  };

  inputOnChange = (val) => {
    this.setState({ message: val });
  };

  handleSendingAscii = (deviceId) => {
    return () => {
      Dialog.confirm({
        title: '发送文本命令',
        content: <Input placeholder="请输出消息: " onChange={this.inputOnChange} />,
        onOk: () => {
          return new Promise((resolve) => {
            const { message } = this.state;
            axios.post('/api/sendAscii', {
              deviceId,
              data: message,
            }).then(() => {
              resolve();
              Message.success('Message sent!');
            }).catch((error) => {
              resolve();
              Message.error(`Sending error, caused by ${error.response.statusText}`);
            });
          });
        },
      });
    };
  };

  handleDelete = (deviceId) => {
    return () => {
      Dialog.confirm({
        title: '确认删除?',
        content: '确认删除?',
        onOk: () => {
          return new Promise((resolve) => {
            axios.delete(`/api/device/${deviceId}`).then(() => {
              resolve();
              Message.success('Device deleted!');
              this.fetchData();
            }).catch((error) => {
              resolve();
              Message.error(`Deletion error, caused by ${error.response.statusText}`);
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
          style={{ marginLeft: '5px' }}
          onClick={this.handleSendingAscii(deviceId)}
        >
          <FormattedMessage id="app.btn.message" />
        </Button>
        <Button
          type="normal"
          style={{ marginLeft: '5px' }}
          onClick={this.handleDelete(deviceId)}
        >
          <FormattedMessage id="app.btn.delete" />
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

