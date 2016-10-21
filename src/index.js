import * as ReduxForm from 'redux-form';
import wrapper from './wrapper';
import { reduxFormMiddleware } from './middlewares';

module.exports = {
  ...ReduxForm,
  reduxForm: wrapper(ReduxForm.reduxForm),
  reduxFormMiddleware,
};
