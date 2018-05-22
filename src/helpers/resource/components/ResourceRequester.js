import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {
  resourceCreateRequest,
  // resourceUpdateRequest,
  // resourceDeleteRequest,
} from '../../../modules/resource/actions'

class ResourceRequester extends React.Component {
  state = {
    requestResult: null,
    error: null,
    loading: false,
  }

  getRequesResultValuesObj() {
    const {requestResult} = this.state
    const entities = requestResult && requestResult.entities
    const result = requestResult && requestResult.data

    return {entities, requestResult, result}
  }

  getStatusObj() {
    const error = !!this.state.error
    const loading = this.state.loading
    const success = !!this.state.requestResult && !loading
    const initial = !error && !loading && !success

    return {error, initial, loading, success}
  }

  createResource = data => {
    this.setState({loading: true})
    this.requestResourceCreate(data).then(
      this.requestResourceSuccess,
      this.requestResourceError,
    )
  }

  requestResourceError = error => {
    this.setState({loading: false, error})
  }

  requestResourceSuccess = payload => {
    const requestResult = {
      api: payload.api,
      data: payload.data,
      entities: payload.entities,
      entityType: payload.entityType,
      resource: payload.resource,
    }

    this.setState({
      requestResult,
      error: null,
      loading: false,
    })
  }

  requestResourceCreate = data => {
    const {requestCreate, resource, entityType} = this.props
    return requestCreate(resource, data, entityType)
  }

  // requestResourceDelete = data => {
  //   const {requestDelete, resource, entityType} = this.props
  //   return requestDelete(resource, data, entityType)
  // }

  // requestResourceUpdate = data => {
  //   const {requestUpdate, resource, entityType} = this.props
  //   return requestUpdate(resource, data, entityType)
  // }

  resetState = () => {
    this.setState({
      requestResult: null,
      error: null,
      loading: false,
    })
  }

  render() {
    if (typeof this.props.children !== 'function') {
      throw new Error('Children should be a Function!')
    }

    const {error} = this.state
    const {entityType} = this.props
    const {result, ...requestResultValues} = this.getRequesResultValuesObj()

    return this.props.children({
      createResource: this.createResource,
      status: this.getStatusObj(),
      error,
      entityType,
      result,
      ...requestResultValues,
    })
  }
}

ResourceRequester.propTypes = {
  children: PropTypes.func.isRequired,
  entityType: PropTypes.string,
  // list: PropTypes.bool.isRequired,
  requestCreate: PropTypes.func,
  // requestDelete: PropTypes.func,
  // requestUpdate: PropTypes.func,
  // requestParams: PropTypes.object,
  resource: PropTypes.string.isRequired,
  // resourceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

const mapDispatchToProps = {
  requestCreate: resourceCreateRequest,
  // requestDelete: resourceDeleteRequest,
  // requestUpdate: resourceUpdateRequest,
}

export default connect(null, mapDispatchToProps)(ResourceRequester)
