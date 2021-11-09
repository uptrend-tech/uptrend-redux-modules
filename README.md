<div align="center">
<h1>uptrend-redux-modules</h1>

<p>Redux Module (redux + redux-saga + redux-saga-thunk) for requesting resources from API and storing response data into entities if provided a normalizr schema.</p>
</div>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fuptrend-tech%2Fuptrend-redux-modules.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fuptrend-tech%2Fuptrend-redux-modules?ref=badge_shield)

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

At Uptrend we enjoy building React applications and have had success using
redux + normalizr to manage state and redux-saga + redux-saga-thunk to
orchestrate application side effects (i.e. asynchronous things like data
fetching). Code is easy to understand and typically works as expected but
someone could have a criticism about the amount of ceremony and boilerplate
required.

Typically, whenever adding a new entity to an app it required us to write
reducers, actions, sagas, schemas, selectors, and container components to get
basic CRUD functionality.

## This solution

Create a concise and straightforward way to make HTTP requests that normalize
response handling including normalization of response data into index entities
in the redux store. To get CRUD functionality for a new entity, you add a
normalizr schema and use the provided actions and selectors provided by URM
(uptrend-redux-modules). URM also provides render prop React components that
simplify and reduce the amount of code needed.

Below are code examples to highlight what using URM resource and entities looks
like:

![URM Resource & Entities Graph](https://sprite.link/chart/Z3JhcGggVEQKQVtVUk0gQWN0aW9uOiBSRVNPVVJDRV9MSVNUX1JFQURfUkVRVUVTVF0KQihVUk0gUmVzb3VyY2UgU2FnYSkKQ3tBUEkgQ2FsbCBSZXN1bHR9CkQoVVJNIEFjdGlvbjogUkVTT1VSQ0VfTElTVF9SRUFEX0ZBSUxVUkUpCkUoVVJNIEFjdGlvbjogUkVTT1VSQ0VfTElTVF9SRUFEX1NVQ0NFU1MpCkYoVVJNIFJlc291cmNlIFJlZHVjZXIpCgpBIC0tPnwiKGRpc3BhdGNoZWQgYWN0aW9uKSJ8IEIKQiAtLT4gfCIoSFRUUCByZXF1ZXN0IG1hZGUgdXNpbmcgQVBJIHNlcnZpY2UpInxDCkMgLS0%2BfGVycm9yfCBECkMgLS0%2BfHN1Y2Nlc3N8IEUKCkEgLS0%2BIEYKRCAtLT4gRgpFIC0tPiBGCgoKTXtVUk0gRW50aXRpZXMgTWlkZGxld2FyZX0KTigiUGF5bG9hZCBkYXRhIG5vcm1hbGl6ZWQiKQpPW0FjdGlvbjogRU5USVRJRVNfUkVDRUlWRV0KUChVUk0gRW50aXRpZXMgUmVkdWNlcikKCkUgLS0%2BIE0KTSAtLT4gfCJJZiBhY3Rpb24ncyBgISFtZXRhLm5vcm1hbGl6ZUVudGl0aWVzYCAmJiBgbWV0YS5lbnRpdHlUeXBlYCBzY2hlbWEifE4KTiAtLT4gfCJub3JtYWxpemUoc2NoZW1hLCBwYXlsb2FkLmRhdGEpInxPCk8gLS0%2BIFA%3D.png)
### ResourceDetailLoader Component

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

### ResourceListLoader Component

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

### Using Resource Redux-Saga-Thunk Style

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
    this.loadGroups()
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

### Redux Modules

There 

// TODO

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Installation](#installation)
* [Usage](#usage)
* [Inspiration](#inspiration)
* [Other Solutions](#other-solutions)
* [Contributors](#contributors)
* [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
yarn add uptrend-redux-modules
```

#### Example Project Usage

Below is an example of how one may set it up in a react app using the resource 
and entities redux-modules.

Do note there are many ways you could organize your project and this example is
not strict guidelines by any means.

#### Resource & Entities

* `src/store/modules/resource/index.js`

  ```js
  // - src/store/modules/resource/index.js
  import {createResource} from 'uptrend-redux-modules'

  // createResource(...) => { actions, reducers, sagas, selectors }
  export default createResource()
  ```

* `src/store/modules/entities/index.js`

  ```js
  // - src/store/modules/entities/index.js
  import {createEntities} from 'uptrend-redux-modules'
  import schemas from './schemas'

  // createEntities(...) => { actions, middleware, reducers, sagas, selectors }
  export default createEntities({schemas})
  ```

* `src/store/modules/entities/schema.js`

  ```js
  // - src/store/modules/entities/schemas.js
  import {schema} from 'normalizr'

  export const user = new schema.Entity('users')
  export const team = new schema.Entity('teams', {owner: user, members: [user]})
  ```

* `src/store/actions.js`

  ```js
  // - src/store/actions.js
  import {actions as entities} from 'src/store/modules/entities';
  import {actions as resource} from 'src/store/modules/resource';

  export {
    ...entities,
    ...resource,
  }
  ```

* `src/store/middlewares.js`

  ```js
  // - src/store/middlewares.js
  import {middleware as entities} from 'src/store/modules/entities'

  export default [
    // redux-modules middlewares
    entities,
  ]
  ```

- `src/store/reducers.js`

  ```js
  // - src/store/reducer.js
  import {combineReducers} from 'redux'

  import {reducer as entities} from 'src/store/modules/entities'
  import {reducer as resource} from 'src/store/modules/resource'

  export default combineReducers({
    entities,
    resource,
  })
  ```

- `src/store/sagas.js`

  ```js
  // - src/store/sagas.js
  import {sagas as entities} from 'src/store/modules/entities'
  import {sagas as resource} from 'src/store/modules/resource'

  // single entry point to start all Sagas at once
  export default function*(services = {}) {
    try {
      yield all([
        // app specific sagas
        example(services),

        // redux-modules sagas
        entities(services),
        resource(services),
      ])
    } catch (error) {
      console.error('ROOT SAGA ERROR!!!', error)
      console.trace()
    }
  }
  ```

- `src/store/selectors.js`

  ```js
  // - src/store/selectors.js
  import {selectors as fromEntities} from 'src/store/modules/entities'
  import {selectors as fromResource} from 'src/store/modules/resource'

  export {fromEntities, fromResource}
  ```

## Usage

// TODO

## Inspiration

Organizing actions, reducers, selectors, sagas, etc. into a module is based on
[redux-modules][redux-modules] from [Diego Haz](https://twitter.com/diegohaz).

The resource and entities modules specifically are modified version of those
found in [redux-modules][redux-modules] and [ARc.js][arc-redux-modules].

## Other Solutions

I'm not aware of any, if you are please [make a pull request][prs] and add it
here!

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/126236?v=4" width="100px;"/><br /><sub><b>Brandon Orther</b></sub>](http://uptrend.tech)<br />[💻](https://github.com/uptrend-tech/redux-modules-resource-entities/commits?author=orther "Code") [🚇](#infra-orther "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/uptrend-tech/redux-modules-resource-entities/commits?author=orther "Tests") [💡](#example-orther "Examples") | [<img src="https://avatars1.githubusercontent.com/u/3457993?v=4" width="100px;"/><br /><sub><b>Dylan Foster</b></sub>](https://www.linkedin.com/profile/view?id=233369645)<br />[🐛](https://github.com/uptrend-tech/redux-modules-resource-entities/issues?q=author%3Adyyylan "Bug reports") [🤔](#ideas-dyyylan "Ideas, Planning, & Feedback") |
| :---: | :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/uptrend-tech/uptrend-redux-modules.svg?style=flat-square
[build]: https://travis-ci.org/uptrend-tech/uptrend-redux-modules
[coverage-badge]: https://img.shields.io/codecov/c/github/uptrend-tech/uptrend-redux-modules.svg?style=flat-square
[coverage]: https://codecov.io/github/uptrend-tech/uptrend-redux-modules
[version-badge]: https://img.shields.io/npm/v/uptrend-redux-modules.svg?style=flat-square
[package]: https://www.npmjs.com/package/uptrend-redux-modules
[downloads-badge]: https://img.shields.io/npm/dm/uptrend-redux-modules.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/uptrend-redux-modules
[license-badge]: https://img.shields.io/npm/l/uptrend-redux-modules.svg?style=flat-square
[license]: https://github.com/uptrend-tech/uptrend-redux-modules/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/uptrend-tech/uptrend-redux-modules/blob/master/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/uptrend-tech/uptrend-redux-modules.svg?style=social
[github-watch]: https://github.com/uptrend-tech/uptrend-redux-modules/watchers
[github-star-badge]: https://img.shields.io/github/stars/uptrend-tech/uptrend-redux-modules.svg?style=social
[github-star]: https://github.com/uptrend-tech/uptrend-redux-modules/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20uptrend-redux-modules%20by%20%40uptrend-tech%20https%3A%2F%2Fgithub.com%2Fuptrend-tech%2Fuptrend-redux-modules%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/uptrend-tech/uptrend-redux-modules.svg?style=social
[emojis]: https://github.com/uptrend-tech/all-contributors#emoji-key
[all-contributors]: https://github.com/uptrend-tech/all-contributors
[arc-redux-modules]: https://github.com/diegohaz/arc/wiki/Redux-modules
[redux-modules]: https://github.com/diegohaz/redux-modules


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fuptrend-tech%2Fuptrend-redux-modules.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fuptrend-tech%2Fuptrend-redux-modules?ref=badge_large)