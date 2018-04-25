# Usage Examples
## Using Resource Redux-Saga-Thunk Style

Resource actions provide a promise based interface that `redux-saga-thunk`
allows. Below shows how a resource can use without using selectors. This is nice
when you need resource data to save locally.

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => ({
  loadGroups: () =>
    dispatch(resourceListReadRequest('group', {active: true}, 'group')),
});

class GroupListContainer extends React.Component {
  state = {
    loading: false,
    groupList: null,
  };

  componentDidMount() {
    this.fetchGroups();
  }

  loadGroups() {
    this.setState({ loading: true });
    this.props.loadGroups().then(this.handleLoadSuccess, this.handleLoadFail);
  }

  handleLoadFail = error => {
    this.setState({ loading: false, error });
  };

  handleLoadSuccess = ({entities}) => {
    this.setState({ loading: false, groupList: entities });
  };

  render() {
    const { loading, groupList } = this.state;
    
    if (loading) return <div>Loading...</div>;

    return (
      <ul>
        {groupList.map(group => <li key={group.id}>{group.name}</li>)}
      </ul>
    );
  }
}

GroupListContainer.propTypes = {
  fetchTripGroupList: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(GroupListContainer);
```

