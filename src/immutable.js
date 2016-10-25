import * as ReduxForm from 'redux-form/immutable';
import wrapper from './wrapper';
import { reduxFormMiddleware } from './middlewares';

module.exports = {
  ...ReduxForm,
  reduxForm: wrapper(ReduxForm.reduxForm),
  reduxFormMiddleware,
};
