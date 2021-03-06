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
} from '../../observables/';

describe('motionObservable.startWith',
  () => {
    let stream;
    let mockObserver;
    let listener;

    beforeEach(
      () => {
        mockObserver = createMockObserver();
        stream = new MotionObservable(mockObserver.connect);
        listener = stub();
      }
    );

    it('should emit the initialValue',
      () => {
        stream.startWith({ value: 10 }).subscribe(listener);

        expect(listener).to.have.been.calledWith(10);
      }
    );

    it('should pass values through after the initialValue',
      () => {
        stream.startWith({ value: 10 }).subscribe(listener);

        mockObserver.next(20);

        expect(listener).to.have.been.calledWith(20);
      }
    );

    it('should return a remembered stream',
      () => {
        const startingWith = stream.startWith({ value: 10 });
        startingWith.subscribe(() => {});

        mockObserver.next(20);

        startingWith.subscribe(listener);

        expect(listener).not.to.have.been.calledWith(10);
        expect(listener).to.have.been.calledWith(20);
      }
    );

    it('should have a shorthand signature',
      () => {
        stream.startWith(10).subscribe(listener);

        expect(listener).to.have.been.calledWith(10);
      }
    );

    it('should prefer the shorthand signature if there are an incorrect number of named arguments',
      () => {
        const expected = { value: 10, timestamp: 12345 };
        stream.startWith(expected).subscribe(listener);

        expect(listener).to.have.been.calledWith(expected);
      }
    );
  }
);
