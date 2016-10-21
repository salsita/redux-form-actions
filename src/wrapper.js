import React from 'react';
import submits from './submits';

function createPredicate(strOrFn) {
  if (typeof strOrFn === 'string') {
    return action => action.type === strOrFn;
  }
  return strOrFn;
}

export default reduxForm => options => (Component) => {
  const ReduxForm = reduxForm(options)(Component);
  return (props) => {
    const formId = options.form;
    const { onSubmit, succeededAction, failedAction } = props;

    if (onSubmit || succeededAction || failedAction) {
      const succeeded = createPredicate(succeededAction);
      const failed = createPredicate(failedAction);

      if (typeof onSubmit !== 'function') throw new Error(`'${formId}' form > onSubmit must be function or string`);
      if (typeof succeeded !== 'function') throw new Error(`'${formId}' form > succeededAction should be function or string`);

      props = {
        ...props,
        onSubmit: values => new Promise((resolve, reject) => {
          submits[formId] = { succeeded, failed, resolve, reject };
          onSubmit(formId, values);
        }),
      };
    }
    return React.createElement(ReduxForm, props);
  };
};
