# Usage Examples

## ResourceDetailLoader Component

```js
const OrgDetailAutoLoader = ({orgId}) => (
  <ResourceDetailLoader resource="org" resourceId={orgId} autoLoad>
    {({status, result, onEventLoadResource}) => (
      <div>
        <pre>{'autoLoad={true}'}</pre>

        <button onClick={onEventLoadResource} disabled={status.loading}>
          Load Resource
        </button>

        {status.initial && <span className="label label-default">initial</span>}
        {status.loading && <span className="label label-primary">loading</span>}
        {status.error && <span className="label label-danger">error</span>}
        {status.success && <span className="label label-success">success</span>}

        {status.loading ? (
          <h5>Loading...</h5>
        ) : (
          result && (
            <div>
              <div>
                Org ID: <code>{result.id}</code>
              </div>
              <div>
                Active: <code>{result.active ? 'Yes' : 'No'}</code>
              </div>
            </div>
          )
        )}
      </div>
    )}
  </ResourceDetailLoader>
)
```

<img src="https://user-images.githubusercontent.com/126236/39789235-7e70c508-52e3-11e8-8126-da099e063d9b.gif" width="370">

## ResourceListLoader Component

```js
const OrgListLoader = () => (
  <ResourceListLoader resource="org">
    {({status, result, onEventLoadResource}) => (
      <div>
        <div>
          <pre>{'autoLoad={false}'}</pre>
          <pre>{JSON.stringify(status, null, 2)}</pre>
        </div>

        <button onClick={onEventLoadResource} disabled={status.loading}>
          Load Resource
        </button>

        {status.initial && <span className="label label-default">initial</span>}
        {status.loading && <span className="label label-primary">loading</span>}
        {status.error && <span className="label label-danger">error</span>}
        {status.success && <span className="label label-success">success</span>}

        {status.loading ? (
          <h5>Loading...</h5>
        ) : (
          result &&
          result.map(org => (
            <div key={org.id}>
              <span>
                Org ID: <code>{org.id}</code>
              </span>
              <span>
                Active: <code>{org.active ? 'Yes' : 'No'}</code>
              </span>
            </div>
          ))
        )}
      </div>
    )}
  </ResourceListLoader>
)
```

<img src="https://user-images.githubusercontent.com/126236/39788918-9b5115e4-52e1-11e8-8107-d5e9ff14e727.gif" width="370">

## Using Resource Redux-Saga-Thunk Style

Resource actions provide a promise based interface that `redux-saga-thunk`
allows. Below shows how a resource can use without using selectors. This is nice
when you need resource data to save locally.

```javascript
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const mapDispatchToProps = dispatch => ({
  loadGroups: () =>
    dispatch(resourceListReadRequest('group', {active: true}, 'group')),
})

class GroupListContainer extends React.Component {
  state = {
    loading: false,
    groupList: null,
  }

  componentDidMount() {
    this.fetchGroups()
  }

  loadGroups() {
    this.setState({loading: true})
    this.props.loadGroups().then(this.handleLoadSuccess, this.handleLoadFail)
  }

  handleLoadFail = error => {
    this.setState({loading: false, error})
  }

  handleLoadSuccess = ({entities}) => {
    this.setState({loading: false, groupList: entities})
  }

  render() {
    const {loading, groupList} = this.state

    if (loading) return <div>Loading...</div>

    return (
      <ul>{groupList.map(group => <li key={group.id}>{group.name}</li>)}</ul>
    )
  }
}

GroupListContainer.propTypes = {
  fetchTripGroupList: PropTypes.func.isRequired,
}

export default connect(null, mapDispatchToProps)(GroupListContainer)
```
