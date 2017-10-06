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
  isPoint2D,
} from '../../typeGuards';

import {
  Constructor,
  MotionReactiveMappable,
  Observable,
  ObservableWithMotionOperators,
  Point2D,
} from '../../types';

import {
  _ReactiveMapOptions,
} from './_reactiveMap';

export interface MotionMathOperable<T> {
  _mathOperator<U extends T & (number | Point2D)>(
    operation: (upstream: number, parameter: number) => number,
    amount$: U | Observable<U>,
    options?: _ReactiveMapOptions,
  ): ObservableWithMotionOperators<U>;
}

export function withMathOperator<T, S extends Constructor<MotionReactiveMappable<T>>>(superclass: S): S & Constructor<MotionMathOperable<T>> {
  return class extends superclass implements MotionMathOperable<T> {
    /**
     * Applies the operation to each dimension and dispatches the result.
     */
    _mathOperator<U extends T & (number | Point2D)>(operation: (upstream: number, parameter: number) => number, amount$: U | Observable<U>, options?: _ReactiveMapOptions): ObservableWithMotionOperators<U> {
      return (this as any as MotionReactiveMappable<U>)._reactiveMap({
        transform: ({ upstream, amount }) => {
          if (isPoint2D(upstream)) {
            return {
              x: operation(upstream.x, (amount as Point2D).x),
              y: operation(upstream.y, (amount as Point2D).y),
            } as U;
          } else {
            return operation(upstream as number, amount as number) as U;
          }
        },
        inputs: {
          amount: amount$,
        },
        ...options
      });
    }
  };
}
