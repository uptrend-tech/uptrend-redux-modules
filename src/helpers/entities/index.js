import createEntityDetail from './components/EntityDetail'
import createEntityList from './components/EntityList'

export default ({entities}) => {
  const EntityDetail = createEntityDetail({entities})
  const EntityList = createEntityList({entities})

  return {
    EntityDetail,
    EntityList,
  }
}
