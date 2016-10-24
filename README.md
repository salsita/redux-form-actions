# redux-form-actions

Redux Form provides way to make asynchronous submit validation,
but API can use only promises. For Redux applications, using actions is more natural.
Especially when you are using asynchronous flow abstraction like sagas or observables.

Redux Form Actions is wrapper around Redux Form with action driven submit validations.

## Installation

```
npm install --save redux-form-actions
```

## Usage Guide

### #1 Declare actions

Declare action types and actions for form handling

```javascript
export const SUBMIT_CONTACT_FORM = 'SUBMIT_CONTACT_FORM';
export const SUBMIT_CONTACT_OK = 'SUBMIT_CONTACT_OK';
export const SUBMIT_CONTACT_FAILED = 'SUBMIT_CONTACT_FAILED';

export const submitContactForm = (form, values) => ({
  type: SUBMIT_CONTACT_FORM,
  payload: { form, values }
});

export const submitContactOk = () => ({
  type: SUBMIT_CONTACT_OK
});

export const submitContactFailed = (err) => ({
  type: Action.SUBMIT_CONTACT_FAILED,
  payload: err
});
```

### #2 Create Form

Create form component same as with Redux Form,
https://redux-form.com/6.1.1/docs/GettingStarted.md/#step-2

For convenience `redux-form-actions` re-export all stuff from `redux-form` so
you can import fields also from `redux-form-actions` module.

Decorate the form component using reduxFrom from `redux-form-actions`.

```javascript
import { Field, reduxForm } from 'redux-form-actions';

// ContactForm = ....

export default reduxForm({
  form: 'contact' // a unique name for this form
})(ContactForm);
```

### #3 Render Form

Put form to your container. Unlike plain Redux Form `onSubmit` now
expecting action creator. This action is dispatched on submit.
And submit is resolved when action with matching
`succeededAction` or `failedAction` type is dispatched.

```javascript
import * as Action from '../actions';

class ContactPage extends React.Component {  
  render() {
    return (
      <ContactForm
        onSubmit={this.props.submitContactForm}
        succeededAction={Action.SUBMIT_CONTACT_OK}
        failedAction={Action.SUBMIT_CONTACT_FAILED}
      />
    );
  }
}
```

### #4 Register middleware

Middleware is essential to handle declared `succeededAction` and `failedActions`.

```javascript
import { reduxFormMiddleware } from 'redux-form-actions';

const store = createStore(
  rootReducer,
  applyMiddleware(
    reduxFormMiddleware
  )
);
```

### #4 Put all action together

Finally put all together, using thunk, saga or observable

[redux-observable](https://redux-observable.js.org/) epic:
```javascript
export default action$ => {
  return action$
  .ofType(Actions.SUBMIT_CONTACT_FORM)
  .mergeMap(action => {
    const { form, values } = action.payload;
    return ajax.post(`/submits/${form}`, values)
        .map(submitContactOk)
        .catch(submitContactFailed)    
  });
};
```

Alternatively, same logic, using [redux-saga](http://yelouafi.github.io/redux-saga/) saga:
```javascript
function* constactFormSaga() {
  while (true) {
    const action = yield take(Actions.SUBMIT_CONTACT_FORM);
    const { form, values } = action.payload;
    try {
      yield call(FormApi.submit, `/submits/${form}`, values);
      yield put(submitContactOk())
    } catch (err) {
      yield put(submitContactFailed(err))
    }
}
```

## Immutable JS

`redux-form-actions` provide Immutable.JS variant in same way as original `redux-form`.

```javascript
import { reduxForm } from 'redux-form-actions/immutable'
```
