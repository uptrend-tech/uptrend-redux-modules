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

[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

// TODO

## This solution

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
npm install --save uptrend-redux-modules
```

## Usage

### Resource & Entities

```js
// - src/store/modules/resource/index.js
import {createResource} from 'uptrend-redux-modules';

// createResource(...) => { actions, reducers, sagas, selectors }
export default createResource();
```

```js
// - src/store/modules/entities/index.js
import {createEntities} from 'uptrend-redux-modules';
import schemas from './schemas';

// createEntities(...) => { actions, middleware, reducers, sagas, selectors }
export default createEntities({schemas});
```

```js
// - src/store/modules/entities/schemas.js
import {schema} from 'normalizr';

export const user = new schema.Entity('users');
export const team = new schema.Entity('teams', {owner: user, members: [user]});
```

```js
// - src/store/actions.js
import {actions as entities} from 'src/store/modules/entities';
import {actions as resource} from 'src/store/modules/resource';

export default {
  ...entities,
  ...resource,
}
```

```js
// - src/store/middlewares.js
import {middleware as entities} from 'src/store/modules/entities';

export default [
  // redux-modules middlewares
  entities,
]
```

```js
// - src/store/reducer.js
import { combineReducers } from 'redux';

import {reducer as entities} from 'src/store/modules/entities';
import {reducer as resource} from 'src/store/modules/resource';

export default combineReducers({
  entities,
  resource,
})
```

```js
// - src/store/sagas.js
import {sagas as entities} from 'src/store/modules/entities';
import {sagas as resource} from 'src/store/modules/resource';

// single entry point to start all Sagas at once
export default function*(services = {}) {
  try {
    yield all([
      // app specific sagas
      example(services),

      // redux-modules sagas
      entities(services),
      resource(services),
    ]);
  } catch (error) {
    console.error('ROOT SAGA ERROR!!!', error);
    console.trace();
  }
}
```

```js
// - src/store/selectors.js
import {selectors as fromEntities} from 'src/store/modules/entities';
import {selectors as fromResource} from 'src/store/modules/resource;

export default {
  fromEntities,
  fromResource,
}
```

// TODO - Add usage examples for every module and it's components.

## Inspiration

Organizing actions, reducers, selectors, sagas, etc. into a module is based on
[Diego Haz](https://twitter.com/diegohaz)' [redux-modules][redux-modules].

The resource and entities modules specificaly are modified version of those
found in [redux-modules][redux-modules] and [ARc.js][arc-redux-modules].

## Other Solutions

I'm not aware of any, if you are please [make a pull request][prs] and add it
here!

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore -->
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
