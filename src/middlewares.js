import { SubmissionError } from 'redux-form';

import submits from './submits';

export const reduxFormMiddleware = store => next => (action) => {  // eslint-disable-line
  /* eslint guard-for-in: 0 */
  for (const formId in submits) {
    const { succeeded, failed, resolve, reject } = submits[formId];
    if (succeeded(action)) {
      delete submits[formId];
      resolve();
    } else if (failed(action)) {
      const { payload } = action;
      let value;
      if (payload) {
        value = payload instanceof SubmissionError ? payload : new SubmissionError(payload);
      }
      delete submits[formId];
      reject(value);
    }
  }
  return next(action);
};
