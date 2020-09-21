import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Pagination, Table, DatePicker, Button, Icon, Input, Select, Balloon } from '@alifd/next';
import IceContainer from '@icedesign/container';
import { iot as iotApi } from '../../../../api';
import styles from '../../../Trash/components/TrashTable/index.module.scss';

export default class EventTable extends Component {
  static propTypes = {
    deviceId: PropTypes.string,
  };

  static defaultProps = {
    deviceId: undefined,
  };

  state = {
    pageNo: 1,
    pageSize: 10,
    deviceId: this.props.deviceId,
    list: [],
    loading: false,
    total: 0,
  };

  fetchData = async () => {
    const { startTime, endTime, deviceId, pageNo, pageSize } = this.state;
    const response = await iotApi.events({
      startTime: startTime === undefined ? undefined : startTime.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime === undefined ? undefined : endTime.format('YYYY-MM-DD HH:mm:ss'),
      deviceId,
      pageNo,
      pageSize,
    });

    this.setState({
      list: response.data,
      total: response.data.length === pageSize ? (pageNo + 1) * pageSize : pageNo * pageSize,
    });
  };

  handlePaginationChange = (current) => {
    this.setState(
      {
        pageNo: current,
      }
    );
  };

  componentDidMount() {
    this.fetchData().catch(console.error);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.pageNo !== this.state.pageNo
    || prevState.pageSize !== this.state.pageSize) {
      this.fetchData().catch(console.error);
    }
  }

  render() {
    return (
      <IceContainer>
        {/* search bar */}
        <div style={{ marginBottom: 20 }}>
          <span>开始时间: </span>
          <DatePicker
            disabledDate={date => (moment().isBefore(date))}
            showTime={{
              defaultValue: moment(),
              secondStep: 10,
            }}
            resetTime
            onChange={v => this.setState({ startTime: v })}
          />
          <span>&nbsp;&nbsp;</span>
          <span>结束时间: </span>
          <DatePicker
            disabledDate={date => (moment().isBefore(date))}
            showTime={{
              secondStep: 10,
            }}
            resetTime
            onChange={v => this.setState({ endTime: v })}
          />
          <span>&nbsp;&nbsp;</span>
          <span>设备ID: </span>
          <Input
            name="deviceId"
            value={this.state.deviceId}
            onChange={v => this.setState({ deviceId: v })}
          />
          <span>&nbsp;&nbsp;</span>
          <span>行数: </span>
          <Select
            name="pageSize"
            key="pageSize"
            dataSource={
              [
                { label: '10', value: '10' },
                { label: '50', value: '50' },
                { label: '100', value: '100' },
                { label: '500', value: '500' },
                { label: '1000', value: '1000' },
              ]}
            value={this.state.pageSize}
            onChange={v => this.setState({ pageSize: Number(v) })}
            style={{ width: 100 }}
          />
          <span>&nbsp;&nbsp;</span>
          <Button onClick={() => this.fetchData().catch(console.error)} key="refresh">
            <Icon type="refresh" />
          </Button>
        </div>
        <Table
          dataSource={this.state.list}
          loading={this.state.loading}
        >
          <Table.Column title="id" dataIndex="id" key="id" width={60} />
          <Table.Column title="时间" dataIndex="time" key="time" width={150} />
          <Table.Column title="设备ID" dataIndex="deviceId" key="deviceId" width={100} />
          <Table.Column title="类型" dataIndex="type" key="type" width={150} />
          <Table.Column
            title="详情"
            dataIndex="details"
            key="details"
            width={400}
            cell={
              (val) => {
                if (val === undefined || val === null) {
                  return '-';
                }

                const trigger = (
                  <span
                    style={
                      {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '400px',
                        display: 'inline-block',
                        wordBreak: 'break-all',
                      }
                    }
                  >
                    {JSON.stringify(val)}
                  </span>);

                return (
                  <Balloon
                    closable={false}
                    trigger={trigger}
                  >
                    <ul>
                      {
                        Object.keys(val)
                          .map(key =>
                            (<li key={key}><b>{key}: </b> {val[key]}</li>)
                          )
                      }
                    </ul>
                  </Balloon>
                );
              }
            }
          />
        </Table>
        <Pagination
          className={styles.pagination}
          pageSize={this.state.pageSize}
          current={this.state.pageNo}
          total={this.state.total}
          onChange={this.handlePaginationChange}
        />
      </IceContainer>
    );
  }
}
