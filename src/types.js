import t from 'tcomb';

// --
// -- Redux
// --

export const State = t.Object;


// --
// -- Entity / Schemas
// --

export const EntityItemId = t.union([t.String, t.Integer]);
export const EntityItem = t.refinement(t.Object, (obj) => obj.hasOwnProperty('id'), 'EntityItem');
export const EntityItemList = t.list(EntityItem);

export const EntityName = t.refinement(t.String, (s) => s.length > 0, 'EntityName');
export const EntitySubState = t.dict(EntityItemId, EntityItem);
export const EntitiesState = t.dict(EntityName, EntitySubState);

export const Schema = t.Any; // TODO make this check for normalizr schema
export const SchemaMap = t.dict(EntityName, Schema);
