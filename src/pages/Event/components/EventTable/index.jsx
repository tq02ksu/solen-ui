import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Pagination, Table, DatePicker, Button, Icon, Input, Balloon, Dialog } from '@alifd/next';
import { iot as iotApi } from '../../../../api';
import styles from '../../../Device/components/TrashTable/index.module.scss';
import { utils, writeFile } from 'xlsx';

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
    this.setState({ loading: true });
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
      loading: false,
    });
  };

  handlePaginationChange = (current) => {
    this.setState(
      {
        pageNo: current,
      },
    );
  };

  handleDownload = () => {
    const handleOk = async () => {
      const { startTime, endTime, deviceId, pageNo, pageSize } = this.state;

      const data = [];
      const map = {};
      for (let et = endTime || moment(); et.isSameOrAfter(startTime);) {
        const response = await iotApi.events({
          startTime: startTime === undefined ? undefined : startTime.format('YYYY-MM-DD HH:mm:ss'),
          endTime: et.format('YYYY-MM-DD HH:mm:ss'),
          pageSize: 500,
          deviceId,
        });
        if ((response.data || []).length === 0) {
          break;
        }
        response.data.forEach((item) => {
          if (!(item.eventId in map)) {
            data.push({
              eventId: item.eventId,
              time: item.time,
              type: item.type,
              details: item.details && item.details.content,
            });
            map[item.eventId] = 1;
            et = moment(item.time, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss,SSS']);
          }
        });
      }
      const workbook = utils.book_new();
      const sheet = utils.json_to_sheet(data);
      utils.book_append_sheet(workbook, sheet, 'events');
      writeFile(workbook, 'events.xlsx');
    };
    Dialog.confirm({
      title: 'Confirm',
      content: '确认导出成excel?',
      onOk: handleOk,
    });
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
      <div>
        {/* search bar */}
        <div style={{ marginBottom: 20 }}>
          <span>开始时间: </span>
          <DatePicker
            disabledDate={(date) => (moment().isBefore(date))}
            showTime={{
              defaultValue: moment(),
              secondStep: 10,
            }}
            resetTime
            onChange={(v) => this.setState({ startTime: v, pageNo: 1 })}
          />
          <span>&nbsp;&nbsp;</span>
          <span>结束时间: </span>
          <DatePicker
            disabledDate={(date) => (moment().isBefore(date))}
            showTime={{
              secondStep: 10,
            }}
            resetTime
            onChange={(v) => this.setState({ endTime: v, pageNo: 1 })}
          />
          <span>&nbsp;&nbsp;</span>
          <span>设备ID: </span>
          <Input
            name="deviceId"
            value={this.state.deviceId}
            onChange={(v) => this.setState({ deviceId: v, pageNo: 1 })}
          />
          <span>&nbsp;&nbsp;</span>
          <Button onClick={() => this.fetchData().catch(console.error)} key="refresh" type="primary">
            <Icon type="refresh" />
          </Button>
          <span>&nbsp;&nbsp;</span>
          <Button onClick={this.handleDownload} key="download">
            <Icon type="download" />
          </Button>
        </div>
        <Table
          dataSource={this.state.list}
          loading={this.state.loading}
        >
          <Table.Column title="事件ID" dataIndex="eventId" key="eventId" width={60} />
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
                    key="eventId"
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
                  <Balloon closable={false} trigger={trigger}>
                    <ul>
                      {
                        Object.keys(val)
                          .map((key) =>
                            (<li key><b>{key}: </b> {val[key]}</li>))
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
      </div>
    );
  }
}
