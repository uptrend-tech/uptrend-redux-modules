import React from 'react'
import PropTypes from 'prop-types'
import ResourceLoader from '../../ResourceLoader'

const resourceLoaderPropTypes = {
  resource: PropTypes.string,
  resourceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

let idCounter = 1

export class DetailResourceLoaderTester extends React.Component {
  instanceId = idCounter++ // to ensure we don't remount a different instance

  render() {
    return (
      <ResourceLoader
        resource={this.props.resource}
        resourceId={this.props.resourceId}
        renderInitial={() => <Status initial />}
        renderError={error => <Status error>{error}</Status>}
        renderLoading={() => <Status loading />}
        renderSuccess={item => <Status success>{item.name}</Status>}
        list={false}
        autoLoad
      >
        {({statusView}) => (
          <div>
            {statusView}
            <FindResourceLoader
              instanceId={this.instanceId}
              resource={this.props.resource}
              resourceId={this.props.resourceId}
            />
          </div>
        )}
      </ResourceLoader>
    )
  }
}
DetailResourceLoaderTester.propTypes = resourceLoaderPropTypes

function FindResourceLoader({resource, resourceId, instanceId}) {
  return (
    <div>
      <span data-testid="resource">{resource}</span>
      <span data-testid="resource-id">{resourceId}</span>
      <span data-testid="instance-id">{instanceId}</span>
    </div>
  )
}

FindResourceLoader.propTypes = {
  instanceId: PropTypes.number,
  ...resourceLoaderPropTypes,
}

export function findResourceLoaderData(getByTestId) {
  return {
    instanceId: getByTestId('instance-id').textContent,
    resource: getByTestId('resource').textContent,
    resourceId: getByTestId('resource-id').textContent,
  }
}

export function Status({children, initial, loading, error, success}) {
  if (initial) return <div data-testid="render-initial">Initial</div>
  if (loading) return <div data-testid="render-loading">Loading</div>
  if (error) return <div data-testid="render-error">{children}</div>
  if (success) return <div data-testid="render-success">{children}</div>
  throw new Error('Status component not passed status prop')
}

Status.propTypes = {
  children: PropTypes.node,
  initial: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  success: PropTypes.bool,
}
