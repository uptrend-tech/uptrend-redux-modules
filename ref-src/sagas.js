import { all, fork } from 'redux-saga/effects';

import aca from 'sow/sagas/aca';
import acaAdmin from 'sow/sagas/acaAdmin';
import analytics from 'sow/sagas/analytics';
import api from 'sow/sagas/api';
import auth from 'sow/sagas/auth';
import certificationDocs from 'sow/sagas/certificationDocs';
import ingredient from 'sow/sagas/ingredient';
import land from 'sow/sagas/land';
import landAnswers from 'sow/sagas/landAnswers';
import miniOsp from 'sow/sagas/miniOsp';
// import orgExportFiles from 'sow/sagas/orgExportFiles';
import gis from 'sow/sagas/gis';
import orgRegistration from 'sow/sagas/orgRegistration';
import organization from 'sow/sagas/org';
import ospApplication from 'sow/sagas/ospApplication';
import ospDefinition from 'sow/sagas/ospDefinition';
import product from 'sow/sagas/product';
import productAnswers from 'sow/sagas/productAnswers';
import productCategory from 'sow/sagas/productCategory';
import productType from 'sow/sagas/productType';
import profile from 'sow/sagas/profile';
import record from 'sow/sagas/record';
import registration from 'sow/sagas/registration';
import resetPassword from 'sow/sagas/resetPassword';
import shell from 'sow/sagas/shell';

// sagas using resource/entities redux-modules
import inspector from 'sow/sagas/inspector';

// redux-modules style automatic sagas import
const req = require.context('.', true, /\.\/.+\/sagas\.js$/);
const reduxModulesSagas = req.keys().map(key => req(key).default);

function* rootReduxModulesSagas(services = {}) {
  try {
    yield all(reduxModulesSagas.map(saga => fork(saga, services)));
  } catch (error) {
    console.error('reduxModulesSagas - ROOT SAGA ERROR!!!', error);
    console.trace();
  }
}

// single entry point to start all Sagas at once
export default function*(services = {}) {
  try {
    yield all([
      aca(),
      api(),
      shell(),
      acaAdmin(),
      analytics(),
      certificationDocs(),
      ingredient(),
      land(),
      landAnswers(),
      miniOsp(),
      // orgExportFiles(),
      orgRegistration(),
      organization(),
      ospApplication(),
      ospDefinition(),
      product(),
      productType(),
      productCategory(),
      productAnswers(),
      record(),
      registration(),
      resetPassword(),
      gis(),
      profile(),

      // using new redux-modules and services
      auth(services),
      inspector(services),
      rootReduxModulesSagas(services),
    ]);
  } catch (error) {
    console.error('ROOT SAGA ERROR!!!', error);
    console.trace();
  }
}
