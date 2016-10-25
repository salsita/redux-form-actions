import React from 'react';
import submits from './submits';

function createPredicate(strOrFn) {
  if (typeof strOrFn === 'string') {
    return action => action.type === strOrFn;
  }
  return strOrFn;
}

function enhance(id, props) {
  const { onSubmit, succeededAction, failedAction } = props;

  if (onSubmit || succeededAction || failedAction) {
    const succeeded = createPredicate(succeededAction);
    const failed = createPredicate(failedAction);

    if (typeof onSubmit !== 'function') throw new Error(`'${id}' form > onSubmit must be function or string`);
    if (typeof succeeded !== 'function') throw new Error(`'${id}' form > succeededAction should be function or string`);

    props = {
      ...props,
      onSubmit: (...args) => new Promise((resolve, reject) => {
        submits[id] = { succeeded, failed, resolve, reject };
        onSubmit(...args);
      }),
    };
  }
  return props;
}

export default reduxForm => options => (Component) => {
  const id = options.form;
  /* enhance options when new components wrapper is created */
  const ReduxForm = reduxForm(enhance(id, options))(Component);
  /* but enhance must be done also on component props
     redux form allows define options on both levels */
  return props => React.createElement(ReduxForm, enhance(id, props));
};
