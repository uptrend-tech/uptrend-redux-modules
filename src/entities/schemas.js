// https://github.com/diegohaz/arc/wiki/Example-redux-modules#entities
import { schema } from 'normalizr';

export const activityLog = new schema.Entity('activityLog');

export const member = new schema.Entity('member');

export const memberSearch = new schema.Entity('memberSearch');

export const memberTrip = new schema.Entity('memberTrip');

export const plan = new schema.Entity('plan');

export const tenant = new schema.Entity('tenant');

export const trip = new schema.Entity('trip');

export const tripGroup = new schema.Entity(
  'tripGroup',
  { trips: [trip] },
  { idAttribute: 'rootTripId' },
);

export const tripPurpose = new schema.Entity('tripPurpose');

export const tripType = new schema.Entity('tripType');

export const vendor = new schema.Entity('vendor');

export const tripEstimate = new schema.Entity('tripEstimate');
