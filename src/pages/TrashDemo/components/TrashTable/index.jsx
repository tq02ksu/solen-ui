import React, { Component } from 'react';
import { Table, Pagination, Button, Dialog } from '@alifd/next';
import { FormattedMessage } from 'react-intl';
import IceContainer from '@icedesign/container';
import styles from './index.module.scss';
import DATA from './data.js';

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

  mockApi = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DATA);
      }, 300);
    });
  };

  fetchData = () => {
    const { current, pageSize } = this.state;
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.mockApi().then((data) => {
          this.setState({
            total: data.length,
            data: data.slice((current - 1) * pageSize, current * pageSize),
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

  handleDetail = () => {
    Dialog.confirm({
      title: '提示',
      content: '暂不支持查看详情',
    });
  };

  renderOper = () => {
    return (
      <div>
        <Button
          type="primary"
          style={{ marginRight: '5px' }}
          onClick={this.handleDetail}
        >
          <FormattedMessage id="app.btn.detail" />
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
            <Table.Column title="名称" dataIndex="name" />
            <Table.Column title="工艺" dataIndex="technique" />
            <Table.Column title="粒径" dataIndex="diameter" />
            <Table.Column title="球形度" dataIndex="sphereRatio" />
            <Table.Column title="氧、氮含量" dataIndex="composition" />
            <Table.Column title="综合性能" dataIndex="performance" />
            <Table.Column
              title="操作"
              width={200}
              dataIndex="oper"
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

