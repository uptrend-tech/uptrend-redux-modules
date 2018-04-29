import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

export default ({entities}) => {
  const mapStateToProps = (state, {entityId, entityType}) => ({
    entityDetail: entities.selectors.getDetail(state, entityType, entityId),
  })

  // eslint-disable-next-line no-unused-vars
  const EntityDetail = ({children, entityDetail, ...props}) =>
    children(entityDetail)

  EntityDetail.propTypes = {
    children: PropTypes.func.isRequired,
    entityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    entityType: PropTypes.string.isRequired,
    entityDetail: PropTypes.object,
  }

  return connect(mapStateToProps)(EntityDetail)
}
