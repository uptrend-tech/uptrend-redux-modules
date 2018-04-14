// https://github.com/diegohaz/arc/wiki/Example-redux-modules#entities
import { schema } from 'normalizr';

export const inspector = new schema.Entity('inspectors');

export const inspectorAccess = new schema.Entity('inspectorAccess');

export const org = new schema.Entity('orgs', {}, { idAttribute: 'id' });

export const posts = new schema.Entity('posts');
