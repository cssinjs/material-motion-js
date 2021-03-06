/** @license
 *  Copyright 2016 - present The Material Motion Authors. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy
 *  of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations
 *  under the License.
 */

import { expect, use as useInChai } from 'chai';
import * as sinonChai from 'sinon-chai';
useInChai(sinonChai);

import {
  beforeEach,
  describe,
  it,
} from 'mocha-sugar-free';

import {
  stub,
} from 'sinon';

import {
  createMockObserver,
} from 'material-motion-testing-utils';

import {
  MotionObservable,
} from '../../../observables/';

describe('motionObservable._remember',
  () => {
    let stream;
    let mockObserver;
    let listener1;
    let listener2;
    let listener3;

    beforeEach(
      () => {
        mockObserver = createMockObserver();
        stream = new MotionObservable(mockObserver.connect);

        listener1 = stub();
        listener2 = stub();
        listener3 = stub();
      }
    );

    it('should forward values to all observers',
      () => {
        const rememberedStream = stream._remember();
        rememberedStream.subscribe(listener1);
        rememberedStream.subscribe(listener2);

        mockObserver.next(1);

        expect(listener1).to.have.been.calledWith(1);
        expect(listener2).to.have.been.calledWith(1);
      }
    );

    it('should cache old values',
      () => {
        const rememberedStream = stream._remember();
        rememberedStream.subscribe(listener1);

        mockObserver.next(1);

        rememberedStream.subscribe(listener2);

        expect(listener2).to.have.been.calledWith(1);
      }
    );

    it('should prevent upstream work from being duplicated',
      () => {
        const rememberedStream = stream._tap({ sideEffect: listener1 })._remember();
        rememberedStream.subscribe(listener2);
        rememberedStream.subscribe(listener3);

        mockObserver.next(1);

        expect(listener1).to.have.been.calledOnce;
        expect(listener2).to.have.been.calledOnce;
        expect(listener3).to.have.been.calledOnce;
      }
    );
  }
);
