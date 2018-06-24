import PropTypes from 'prop-types'
import React from 'react'
import {polyfill} from 'react-lifecycles-compat'
import {connect} from 'react-redux'
import {
  resourceDetailReadRequest,
  resourceListCreateRequest,
  resourceListReadRequest,
} from '../../../modules/resource/actions'

class ResourceLoader extends React.Component {
  state = {
    requestResult: null,
    error: null,
    loading: false,
  }

  static getDerivedStateFromProps(props, state) {
    const resourcePath = `${props.resource}:${props.resourceId}`

    if (resourcePath !== state.prevResourcePath) {
      // State updated
      return {
        prevResourcePath: resourcePath,
      }
    }

    // No state update necessary
    return null
  }

  componentDidMount() {
    this.loadResourceAutomatically()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.prevResourcePath !== this.state.prevResourcePath) {
      this.loadResourceAutomatically()
    }
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
    const done = error || success

    return {done, error, initial, loading, success}
  }

  getStatusViewError(error) {
    const {renderError} = this.props
    return renderError ? renderError(error) : null
  }

  getStatusViewInitial() {
    const {renderInitial} = this.props
    return renderInitial ? renderInitial() : null
  }

  getStatusViewLoading() {
    const {renderLoading} = this.props
    return renderLoading ? renderLoading() : null
  }

  getStatusViewSuccess(result, requestResultValues) {
    const {renderSuccess} = this.props
    return renderSuccess ? renderSuccess(result, requestResultValues) : null
  }

  getStatusView() {
    const status = this.getStatusObj()

    if (status.error) {
      return this.getStatusViewError(this.state.error)
    } else if (status.loading) {
      return this.getStatusViewLoading()
    } else if (status.success) {
      const {result, ...requestResultValues} = this.getRequesResultValuesObj()
      return this.getStatusViewSuccess(result, requestResultValues)
    } else if (status.initial) {
      return this.getStatusViewInitial()
    }

    return null
  }

  loadResource = params => {
    this.setState({loading: true})
    this.requestResource(params).then(
      this.loadResourceSuccess,
      this.loadResourceError,
    )
  }

  loadResourceAutomatically = () => {
    if (this.props.autoLoad) {
      this.loadResource()
    }
  }

  loadResourceError = error => {
    this.setState({loading: false, error})
  }

  loadResourceSuccess = payload => {
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

  nextPropsChangeResource(nextProps) {
    if (nextProps.resource !== this.props.resource) return true
    if (nextProps.resourceId !== this.props.resourceId) return true
    return false
  }

  onEventLoadResource = e => {
    e.preventDefault()
    this.loadResource()
  }

  requestResource = params => {
    return this.props.list
      ? this.requestResourceList(params)
      : this.requestResourceDetail(params)
  }

  requestResourceDetail = () => {
    const {requestDetailRead, resource, resourceId, entityType} = this.props
    return requestDetailRead(resource, resourceId, entityType)
  }

  requestResourceList = dynamicParams => {
    const {postRequest, requestParams} = this.props
    const params = {...dynamicParams, ...requestParams}
    return postRequest
      ? this.requestResourceListCreate(params)
      : this.requestResourceListRead(params)
  }

  requestResourceListCreate = params => {
    const {entityType, resource, requestListCreate} = this.props
    return requestListCreate(resource, params, entityType)
  }

  requestResourceListRead = params => {
    const {entityType, resource, requestListRead} = this.props
    return requestListRead(resource, params, entityType)
  }

  render() {
    if (typeof this.props.children !== 'function') {
      throw new Error('Children should be a Function!')
    }

    const {error} = this.state
    const {entityType} = this.props
    const {result, ...requestResultValues} = this.getRequesResultValuesObj()

    return this.props.children({
      onEventLoadResource: this.onEventLoadResource,
      loadResource: this.loadResource,
      status: this.getStatusObj(),
      statusView: this.getStatusView(),
      error,
      entityType,
      result,
      ...requestResultValues,
    })
  }
}

ResourceLoader.propTypes = {
  children: PropTypes.func.isRequired,
  entityType: PropTypes.string,
  list: PropTypes.bool.isRequired,
  autoLoad: PropTypes.bool,
  postRequest: PropTypes.bool,
  renderError: PropTypes.func,
  renderInitial: PropTypes.func,
  renderLoading: PropTypes.func,
  renderSuccess: PropTypes.func,
  requestDetailRead: PropTypes.func,
  requestListCreate: PropTypes.func,
  requestListRead: PropTypes.func,
  requestParams: PropTypes.object,
  resource: PropTypes.string.isRequired,
  resourceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

// Polyfill component so the new lifecycles will work with older React versions
polyfill(ResourceLoader)

const mapDispatchToProps = {
  requestDetailRead: resourceDetailReadRequest,
  requestListCreate: resourceListCreateRequest,
  requestListRead: resourceListReadRequest,
}

export default connect(
  null,
  mapDispatchToProps,
)(ResourceLoader)
