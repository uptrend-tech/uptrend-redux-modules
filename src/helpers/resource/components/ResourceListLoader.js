import React from 'react'
import PropTypes from 'prop-types'
import ResourceLoader from './ResourceLoader'

const ResourceListLoader = props => <ResourceLoader {...props} list={true} />

ResourceListLoader.propTypes = {
  children: PropTypes.func.isRequired,
  entityType: PropTypes.string,
  autoCaseKeys: PropTypes.bool,
  autoLoad: PropTypes.bool,
  postRequest: PropTypes.bool,
  renderError: PropTypes.func,
  renderInitial: PropTypes.func,
  renderLoading: PropTypes.func,
  renderSuccess: PropTypes.func,
  requestParams: PropTypes.object,
  resource: PropTypes.string.isRequired,
}

export default ResourceListLoader
