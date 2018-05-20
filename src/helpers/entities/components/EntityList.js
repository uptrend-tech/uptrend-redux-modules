import PropTypes from 'prop-types'
import {connect} from 'react-redux'

export default ({entities}) => {
  const mapStateToProps = (state, {entityIds, entityType}) => ({
    entityList: entities.selectors.getList(state, entityType, entityIds),
  })

  // eslint-disable-next-line no-unused-vars
  const EntityList = ({children, entityList, ...props}) => children(entityList)

  EntityList.propTypes = {
    children: PropTypes.func,
    entityIds: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ).isRequired,
    entityType: PropTypes.string.isRequired,
    entityList: PropTypes.arrayOf(PropTypes.object),
  }

  return connect(mapStateToProps)(EntityList)
}
