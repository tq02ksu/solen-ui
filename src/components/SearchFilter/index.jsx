import React from 'react';
import { injectIntl } from 'react-intl';
import { Button, Search } from '@alifd/next';
import PropTypes from 'prop-types';

function SearchFilter(props) {
  const { buttons, placeholder, setSearch } = props;

  const renderButtons = (align) => {
    const a = align || 'left';
    return buttons
      .filter(item => {
        return (item.align || 'left') === a;
      })
      .map(item => (
        <span key={item.label}>
          {a === 'right' ? <span>&nbsp;&nbsp;</span> : ''}
          <Button type={item.type} onClick={item.onClick} key={item.label} disabled={item.disabled}>{item.label}</Button>
          {a === 'left' ? <span>&nbsp;&nbsp;</span> : ''}
        </span>
      ));
  };

  async function handleSearch(value) {
    setSearch(value);
  }

  return (
    <div style={{ margin: 20 }}>
      {renderButtons('left')}
      <span style={{ float: 'right' }}>
        <Search
          style={{ width: 200 }}
          onSearch={handleSearch}
          placeholder={placeholder}
        />

        {renderButtons('right')}
      </span>
    </div>
  );
}

export default injectIntl(SearchFilter);

SearchFilter.propTypes = {
  buttons: PropTypes.array,
  setSearch: PropTypes.func,
  placeholder: PropTypes.string,
};

SearchFilter.defaultProps = {
  buttons: [],
  setSearch: () => {},
  placeholder: '',
};
