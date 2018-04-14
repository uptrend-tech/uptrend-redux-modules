import { reducer as form } from 'redux-form';
import recycleState from 'redux-recycle';
import { camelize } from 'underscore.string.fp';
import { combineReducers } from 'redux';
import { reducer as thunk } from 'redux-saga-thunk';
import { routerReducer } from 'react-router-redux';

import actions from 'sow/actions/pure';

// original reducers
import auth from 'sow/reducers/auth';
import registration from 'sow/reducers/auth/registration';
import passwordReset from 'sow/reducers/auth/passwordReset';
import layout from 'sow/reducers/layout';
import messaging from 'sow/reducers/messaging';
import orgRegistration from 'sow/reducers/orgRegistration';
import fileUpload from 'sow/reducers/fileUpload';
import gis from 'sow/reducers/gis';
import productCategories from 'sow/reducers/productCategories';
import productTypes from 'sow/reducers/productTypes';
import acaAdminList from 'sow/reducers/acaAdminList';
import profile from 'sow/reducers/profile';
import acaActivityLog from 'sow/reducers/acaActivityLog';
import timezoneList from 'sow/reducers/timezoneList';
import attachment from 'sow/reducers/attachment';
import acaRenewalsList from 'sow/reducers/acaRenewalsList';
import acaPendingList from 'sow/reducers/acaPendingList';
import acaNewRegistrationsList from 'sow/reducers/acaNewRegistrationsList';
import acaInProgressList from 'sow/reducers/acaInProgressList';
import orgExportFiles from 'sow/reducers/orgExportFiles';
import acaAdminAddStaff from 'sow/reducers/acaAdminAddStaff';
import certificationDocs from 'sow/reducers/certificationDocs';

// refactored reducers
import acas from 'sow/reducers/acas';
import ingredients from 'sow/reducers/ingredients';
import landAnswers from 'sow/reducers/landAnswers';
import lands from 'sow/reducers/lands';
import notes from 'sow/reducers/notes';
import organizations from 'sow/reducers/organizations';
import ospApplications from 'sow/reducers/ospApplications';
import ospDefinitions from 'sow/reducers/ospDefinitions';
import ospQualificationQuestions from 'sow/reducers/ospQualificationQuestions';
import ospSections from 'sow/reducers/ospSections';
import productAnswers from 'sow/reducers/productAnswers';
import products from 'sow/reducers/products';
import records from 'sow/reducers/records';
import shell from 'sow/reducers/shell';
import worksheetAnswers from 'sow/reducers/worksheetAnswers';
import worksheetQuestions from 'sow/reducers/worksheetQuestions';
import worksheets from 'sow/reducers/worksheets';

// redux-fractal ported reducers (still need work)
import OspDefEditor from 'sow/components/old/OspDefEditor/reducers';

const mapActionsToStrings = R.map(R.toString);
const recycleReducers = (...actions) =>
  R.map(reducer => recycleState(reducer, mapActionsToStrings(actions)));

const ospAppReducersWithRecycle = recycleReducers(actions.ospApp.reset)({
  notes,
  ospApplications,
  ospQualificationQuestions,
  ospSections,
  worksheetAnswers,
  worksheetQuestions,
  worksheets,
});

export const appReducers = {
  // original reducers
  layout,
  auth,
  registration,
  passwordReset,
  messaging,
  orgRegistration,
  fileUpload,
  gis,
  productCategories,
  productTypes,
  acaAdminList,
  profile,
  acaActivityLog,
  timezoneList,
  attachment,
  acaRenewalsList,
  acaPendingList,
  acaNewRegistrationsList,
  acaInProgressList,
  orgExportFiles,
  acaAdminAddStaff,
  certificationDocs,

  // refactored reducers
  acas,
  organizations,
  ospDefinitions,
  shell,

  // NOTE: reset all these reducers when detail view of org loaded
  // TODO: we should probably plan this out more
  ...recycleReducers(actions.org.resetChildData)({
    ingredients,
    landAnswers,
    lands,
    notes,
    ospApplications,
    ospQualificationQuestions,
    ospSections,
    productAnswers,
    products,
    records,
    worksheetAnswers,
    worksheetQuestions,
    worksheets,
  }),

  // redux-fractal ported reducers
  OspDefEditor,
};

const libReducers = {
  form,
  thunk,
};

const reduxModulesReducers = {};
const req = require.context('.', true, /\.\/.+\/reducer\.js$/);
req.keys().forEach(key => {
  const storeName = camelize(key.replace(/\.\/(.+)\/.+$/, '$1'));
  reduxModulesReducers[storeName] = req(key).default;
});

// root reducer
const rootReducer = combineReducers({
  ...appReducers,
  ...libReducers,
  ...reduxModulesReducers,
  routing: routerReducer,
});

// reset all app state on logout
const resetActionTypes = [String(actions.core.state.reset)];
const resetReducer = R.pick(['routing']); // keep routing state

const safeRootReducer = recycleState(rootReducer, resetActionTypes, resetReducer);

export default safeRootReducer;
