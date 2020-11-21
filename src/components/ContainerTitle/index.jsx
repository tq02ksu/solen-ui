import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Icon } from '@alifd/next';
import styles from './index.module.scss';
import LinkButton from '../LinkButton';

function ContainerTitle(props) {
  const { title, showBackward, history, filters, links } = props;

  return (
    <div>
      <h3 className={styles.title}>
        {
          links.map(l => {
            return (
              <span key={l.to}>
                <LinkButton text type="primary" to={l.to}>
                  {l.text}
                </LinkButton>&nbsp;&nbsp;
                <Icon type="arrow-right" size="xs" />&nbsp;&nbsp;
              </span>
            );
          })
        }
        {
          showBackward ? (
            <a onClick={() => history.goBack()} style={{ marginRight: 10 }}>
              <Icon type="arrow-left" />
            </a>
          ) : ''
        }
        <span style={{ marginRight: 40, display: 'inline-block' }}> {title}</span>
        {filters}
      </h3>
    </div>
  );
}

ContainerTitle.propTypes = {
  title: PropTypes.string.isRequired,
  showBackward: PropTypes.bool,
  filters: PropTypes.array,
  links: PropTypes.array,
};

ContainerTitle.defaultProps = {
  showBackward: false,
  filters: [],
  links: [],
};

export default withRouter(ContainerTitle);
