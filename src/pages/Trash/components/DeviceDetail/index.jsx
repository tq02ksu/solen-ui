import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Balloon, Icon, Tab, Table } from '@alifd/next';
import moment from 'moment';
import { APILoader, Label, Map, Marker } from '@uiw/react-baidu-map';
import { iot as iotApi } from '../../../../api';

export default class DeviceDetail extends Component {
  static propTypes = {
    deviceId: PropTypes.string,
  };

  static defaultProps = {
    deviceId: undefined,
  };

  state = {
    device: {},
  };

  fetchData = async () => {
    if (this.props.deviceId === undefined) {
      return;
    }
    const response = await iotApi.detail(this.props.deviceId);
    this.setState({ device: response.data });
  };

  componentDidMount() {
    this.fetchData().catch(console.error);
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && prevProps.visible === false) {
      this.fetchData().catch(console.error);
    }
  }

  renderLocationInfo() {
    const { device } = this.state;
    if (device.coordinates === undefined || device.coordinates === null) {
      return (<p><Icon type="prompt" size="small" /> 位置信息不可用</p>);
    }

    const coordinate = device.coordinates.filter(c => c.system === 'BD09')[0];

    return (
      <div>
        <h3>位置信息</h3>
        <Table
          dataSource={device.coordinates}
          size="small"
        >
          <Table.Column title="坐标系" dataIndex="system" />
          <Table.Column title="纬度" dataIndex="lat" />
          <Table.Column title="经度" dataIndex="lng" />
        </Table>
        <div style={{ width: '100%', height: 300 }}>
          <APILoader akay="bwgRMCqthfyVy10XNk8FlH3WYM7omk0R">
            <Map zoom={15} center={coordinate}>
              <Marker
                position={coordinate}
                type="loc_blue"
                animation={1}
              />
              <Label position={coordinate} content={`坐标: ${coordinate.lat}, ${coordinate.lng}`} />
            </Map>
          </APILoader>
        </div>
      </div>
    );
  }

  render() {
    const { device } = this.state;
    const dataSource = [
      { column: 'deviceId', label: '设备ID', value: device.deviceId },
      { column: 'rssi', label: '信号强度', value: device.rssi },
      { column: 'voltage', label: '电压(V)', value: device.voltage },
      { column: 'temperature', label: '温度(°C)', value: device.temperature },
      { column: 'gravity', label: '重力', value: device.gravity },
      { column: 'uptime', label: '运行时间', value: device.uptime },
    ];
    return (
      <Tab>
        <Tab.Item title="基本信息" key="basic">
          <h3>基本信息</h3>
          <Table dataSource={dataSource} size="small">
            <Table.Column title="属性" key="label" dataIndex="label" />
            <Table.Column
              title="值"
              key="value"
              dataIndex="value"
              cell={(value, index, record) => {
                if (record.column === 'uptime') {
                  return (
                    <Balloon
                      closable={false}
                      trigger={moment.duration(value, 'seconds').humanize()}
                    >
                      {value} 秒
                    </Balloon>
                  );
                }
                return value;
              }}
            />
          </Table>
        </Tab.Item>
        <Tab.Item title="位置信息" key="location">
          {this.renderLocationInfo()}
        </Tab.Item>
        <Tab.Item title="串口通讯" key="serial-port">
          <p style={device.reports === [] ? {} : { display: 'none' }}>
            <Icon type="prompt" size="small" /> 位置信息不可用
          </p>
          <div style={device.reports ? {} : { display: 'none' }}>
            <h3>收到的消息</h3>
            <Table dataSource={device.reports} size="small">
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
        </Tab.Item>
      </Tab>
    );
  }
}
