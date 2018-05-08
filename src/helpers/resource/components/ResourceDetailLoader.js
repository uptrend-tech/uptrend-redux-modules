import React from 'react'
import PropTypes from 'prop-types'
import ResourceLoader from './ResourceLoader'

const ResourceDetailLoader = props => <ResourceLoader {...props} list={false} />

ResourceLoader.propTypes = {
  children: PropTypes.func.isRequired,
  entityType: PropTypes.string,
  loadOnMount: PropTypes.bool,
  postRequest: PropTypes.bool,
  renderError: PropTypes.func,
  renderInitial: PropTypes.func,
  renderLoading: PropTypes.func,
  renderSuccess: PropTypes.func,
  requestParams: PropTypes.object,
  resource: PropTypes.string.isRequired,
  resourceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default ResourceDetailLoader
