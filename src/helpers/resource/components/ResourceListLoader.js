import React from 'react'
import PropTypes from 'prop-types'

export default function createResourceListLoader({ResourceLoader}) {
  const ResourceListLoader = props => <ResourceLoader {...props} list={true} />

  ResourceListLoader.propTypes = {
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
  }

  return ResourceListLoader
}
