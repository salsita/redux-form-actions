import { assert } from 'chai';
import sinon from 'sinon';

import { reduxFormMiddleware, __RewireAPI__ as rewire } from '../src/middlewares';

describe('reduxFormMiddleware', () => {
  let submits;
  let next;
  let contact;

  beforeEach(() => {
    next = sinon.spy();
    rewire.__Rewire__('submits', (submits = {
      contact: (contact = {
        succeeded: action => action.type === 'CONTACT_SUCC',
        failed: action => action.type === 'CONTACT_FAIL',
        resolve: sinon.spy(),
        reject: sinon.spy()
      })
    }));
  });

  afterEach(() => {
    next = undefined;
    contact = undefined;
    rewire.__ResetDependency__('submits');
  });

  it('next is called ', () => {
    reduxFormMiddleware()(next)({ type: 'FOO' });
    assert.isTrue(next.calledOnce);
    reduxFormMiddleware()(next)({ type: 'CONTACT_SUCC' });
    assert.isTrue(next.calledTwice);
  });

  it('should listen for succes actions ', () => {
    reduxFormMiddleware()(next)({ type: 'FOO' });
    assert.isFalse(contact.resolve.called);
    assert.isFalse(contact.reject.called);
    assert.isDefined(submits.contact);

    reduxFormMiddleware()(next)({ type: 'CONTACT_SUCC' });
    assert.isTrue(contact.resolve.called);
    assert.isFalse(contact.reject.called);
    assert.isUndefined(submits.contact);
  });

  it('should listen for fail actions ', () => {
    reduxFormMiddleware()(next)({ type: 'CONTACT_FAIL' });
    assert.isFalse(contact.resolve.called);
    assert.isTrue(contact.reject.called);
    assert.isUndefined(submits.contact);
  });
});
