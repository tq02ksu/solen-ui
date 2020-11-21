import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '@alifd/next';
import PropTypes from 'prop-types';

function LinkButton(props) {
  const { history, to, onClick, component, text, disabled } = props;

  function handleClick() {
    if (typeof onClick === 'function' && !onClick()) {
      return;
    }
    history.push(to);
  }

  return (
    <Button
      type={props.type}
      component={component}
      text={text}
      disabled={disabled}
      onClick={() => handleClick()}
    >
      {props.children}
    </Button>
  );
}

export default withRouter(LinkButton);

LinkButton.propTypes = {
  to: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.string,
  component: PropTypes.string,
  text: PropTypes.bool,
  disabled: PropTypes.bool,
};

LinkButton.defaultProps = {
  onClick: undefined,
  children: '',
  component: 'button',
  text: false,
  disabled: false,
};
