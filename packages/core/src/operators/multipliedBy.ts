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

import {
  isDefined,
  isPoint2D,
} from '../typeGuards';

import {
  Constructor,
  MotionMathOperable,
  Observable,
  ObservableWithMotionOperators,
  Point2D,
} from '../types';

import {
  _ReactiveMapOptions,
} from './foundation/_reactiveMap';

export type MultipliedByValue<U> = U | Observable<U>;
export type MultipliedByArgs<U> = _ReactiveMapOptions & {
  value$: MultipliedByValue<U>,
};

export interface MotionMultipliable<T> {
  // Since number literals get their own types, `U extends T & number` will
  // resolve to `5` if the upstream value is `5`.  This would break
  // `$.addedBy(5).multipliedBy(4)`, because `multipliedBy` could only take `5`.
  //
  // To work around this, we overload the method signature.  When `T` is a
  // number, we explicitly return an `Observable<number>`.  Otherwise, we can
  // use the type variable `U`.
  multipliedBy<U extends T & number>(kwargs: MultipliedByArgs<U>): ObservableWithMotionOperators<number>;
  multipliedBy<U extends T & number>(value$: MultipliedByValue<U>): ObservableWithMotionOperators<number>;
  multipliedBy<U extends T & Point2D>(kwargs: MultipliedByArgs<U>): ObservableWithMotionOperators<U>;
  multipliedBy<U extends T & Point2D>(value$: MultipliedByValue<U>): ObservableWithMotionOperators<U>;
}

export function withMultipliedBy<T, S extends Constructor<MotionMathOperable<T>>>(superclass: S): S & Constructor<MotionMultipliable<T>> {
  return class extends superclass implements MotionMultipliable<T> {
    /**
     * Multiplies the upstream value by the provided value and emits the
     * result.
     */
    multipliedBy<U extends T & (Point2D | number)>(kwargs: MultipliedByArgs<U>): ObservableWithMotionOperators<U>;
    multipliedBy<U extends T & (Point2D | number)>(value$: MultipliedByValue<U>): ObservableWithMotionOperators<U>;
    multipliedBy<U extends T & (Point2D | number)>({ value$, ...reactiveMapOptions }: MultipliedByArgs<U>): ObservableWithMotionOperators<U> {
      if (!isDefined(value$)) {
        value$ = arguments[0];
      }

      return this._mathOperator({
        operation: (upstream, value) => upstream * value,
        value$,
        ...reactiveMapOptions,
      });
    }
  };
}
