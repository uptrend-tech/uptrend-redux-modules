import {createEntitiesForTests} from '../../../../../utils/test'
import createEntityDetail from '../../EntityDetail'
import createEntityList from '../../EntityList'

const entities = createEntitiesForTests()

export const EntityDetail = createEntityDetail({entities})
export const EntityList = createEntityList({entities})
