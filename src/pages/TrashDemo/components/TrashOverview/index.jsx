import React, { Component } from 'react';
import { Grid, Progress } from '@alifd/next';
import { injectIntl } from 'react-intl';
import IceContainer from '@icedesign/container';
import styles from './index.module.scss';
import DATA from './data.js';

const { Row, Col } = Grid;

@injectIntl
export default class TrashOverview extends Component {
  state = {
    data: [],
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({
      data: DATA,
    });
  };

  render() {
    const { data } = this.state;

    const formatted = [];
    let total = 0;
    Object.keys(data).map(key => total += data[key]);
    formatted.push({
      percent: 100,
      title: '总数',
      value: total,
    });
    Object.keys(data).map(key => formatted.push({
      percent: data[key] / total * 100,
      title: ['低电平', '高电平'][key],
      value: data[key],
    }));

    return (
      <Row gutter={20} wrap>
        {formatted.map((item, index) => {
          return (
            <Col xxs="24" l="6" key={index}>
              <IceContainer className={styles.container}>
                <Progress percent={item.percent} state="error" shape="circle" />
                <div className={styles.content}>
                  <p className={styles.value}>{item.value}</p>
                  <h4 className={styles.title}>{item.title}</h4>
                </div>
              </IceContainer>
            </Col>
          );
        })}
      </Row>
    );
  }
}
