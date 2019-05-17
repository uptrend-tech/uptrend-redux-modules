import PropTypes from 'prop-types'
import React from 'react'
import {polyfill} from 'react-lifecycles-compat'
import {connect} from 'react-redux'
import {
  resourceCreateRequest,
  resourceDeleteRequest,
  resourceDetailReadRequest,
  resourceListCreateRequest,
  resourceListReadRequest,
  resourceUpdateRequest,
} from '../../../modules/resource/actions'

class ResourceLoader extends React.Component {
  _asyncActive = null

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

  componentWillUnmount() {
    // Sets this false so we can prevent setState after unmount
    this._asyncActive = false
  }

  getRequestActionOptionsObj() {
    const {autoCaseKeys} = this.props
    return {autoCaseKeys}
  }

  getRequestResultValuesObj() {
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
      const {result, ...requestResultValues} = this.getRequestResultValuesObj()
      return this.getStatusViewSuccess(result, requestResultValues)
    } else if (status.initial) {
      return this.getStatusViewInitial()
    }

    /* istanbul ignore next */
    return null
  }

  createResource = data => {
    const request = this.requestResourceDetailCreate(data)
    return this.loadResourceAsync(request)
  }

  deleteResource = deleteId => {
    const request = this.requestResourceDetailDelete(deleteId)
    return this.loadResourceAsync(request)
  }

  loadResourceAsync(requestPromise) {
    this._asyncActive = true
    this.setState({loading: true})
    return requestPromise.then(this.loadResourceSuccess, this.loadResourceError)
  }

  loadResource = params => {
    const request = this.requestResource(params)
    return this.loadResourceAsync(request)
  }

  updateResource = data => {
    const request = this.requestResourceDetailUpdate(data)
    return this.loadResourceAsync(request)
  }

  loadResourceAutomatically = () => {
    if (this.props.autoLoad) {
      this.loadResource()
    }
  }

  loadResourceError = error => {
    // Only update if async active (mounted && sent request)
    if (this._asyncActive) {
      this.setState({loading: false, error})
    }
  }

  loadResourceSuccess = payload => {
    // Only update if async active (mounted && sent request)
    if (this._asyncActive) {
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

  requestResourceDetail = dynamicParams => {
    const {postRequest, requestParams} = this.props
    const params = {...requestParams, ...dynamicParams}
    return postRequest
      ? this.requestResourceDetailCreate(params)
      : this.requestResourceDetailRead(params)
  }

  requestResourceDetailCreate = data => {
    const {requestDetailCreate, resource, entityType} = this.props
    const options = this.getRequestActionOptionsObj()
    return requestDetailCreate(resource, data, entityType, options)
  }

  requestResourceDetailDelete = deleteId => {
    const {requestDetailDelete, resource, resourceId, entityType} = this.props
    const finalDeleteId = deleteId === undefined ? resourceId : deleteId
    const options = this.getRequestActionOptionsObj()
    return requestDetailDelete(resource, finalDeleteId, entityType, options)
  }

  requestResourceDetailRead = params => {
    const {requestDetailRead, resource, resourceId, entityType} = this.props
    const options = this.getRequestActionOptionsObj()
    return requestDetailRead(resource, resourceId, params, entityType, options)
  }

  requestResourceDetailUpdate = data => {
    const {requestDetailUpdate, resource, resourceId, entityType} = this.props
    const options = this.getRequestActionOptionsObj()
    return requestDetailUpdate(resource, resourceId, data, entityType, options)
  }

  requestResourceList = dynamicParams => {
    const {postRequest, requestParams} = this.props
    const params = {...requestParams, ...dynamicParams}
    return postRequest
      ? this.requestResourceListCreate(params)
      : this.requestResourceListRead(params)
  }

  requestResourceListCreate = data => {
    const {entityType, resource, requestListCreate} = this.props
    const options = this.getRequestActionOptionsObj()
    return requestListCreate(resource, data, entityType, options)
  }

  requestResourceListRead = params => {
    const {entityType, resource, requestListRead} = this.props
    const options = this.getRequestActionOptionsObj()
    return requestListRead(resource, params, entityType, options)
  }

  render() {
    if (typeof this.props.children !== 'function') {
      throw new Error('Children should be a Function!')
    }

    const {error} = this.state
    const {entityType} = this.props
    const {result, ...requestResultValues} = this.getRequestResultValuesObj()

    return this.props.children(
      {
        onEventLoadResource: this.onEventLoadResource,
        createResource: this.createResource,
        createResourceRequest: this.requestResourceDetailCreate,
        deleteResource: this.deleteResource,
        deleteResourceRequest: this.requestResourceDetailDelete,
        loadResource: this.loadResource,
        loadResourceRequest: this.requestResource,
        updateResource: this.updateResource,
        updateResourceRequest: this.requestResourceDetailUpdate,
        status: this.getStatusObj(),
        statusView: this.getStatusView(),
        error,
        entityType,
        result,
        ...requestResultValues,
      },
      this.props.passThru,
    )
  }
}

ResourceLoader.propTypes = {
  children: PropTypes.func.isRequired,
  entityType: PropTypes.string,
  list: PropTypes.bool.isRequired,
  autoCaseKeys: PropTypes.bool,
  autoLoad: PropTypes.bool,
  postRequest: PropTypes.bool,
  renderError: PropTypes.func,
  renderInitial: PropTypes.func,
  renderLoading: PropTypes.func,
  renderSuccess: PropTypes.func,
  requestDetailCreate: PropTypes.func.isRequired,
  requestDetailDelete: PropTypes.func.isRequired,
  requestDetailRead: PropTypes.func.isRequired,
  requestDetailUpdate: PropTypes.func.isRequired,
  requestListCreate: PropTypes.func.isRequired,
  requestListRead: PropTypes.func.isRequired,
  requestParams: PropTypes.object,
  resource: PropTypes.string.isRequired,
  resourceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  passThru: PropTypes.any,
}

// Polyfill component so the new lifecycles will work with older React versions
polyfill(ResourceLoader)

const mapDispatchToProps = {
  requestDetailCreate: resourceCreateRequest,
  requestDetailDelete: resourceDeleteRequest,
  requestDetailRead: resourceDetailReadRequest,
  requestDetailUpdate: resourceUpdateRequest,
  requestListCreate: resourceListCreateRequest,
  requestListRead: resourceListReadRequest,
}

export default connect(
  null,
  mapDispatchToProps,
  null,
  {pure: false},
)(ResourceLoader)
