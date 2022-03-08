// Copyright 2017-2022 @polkadot/rpc-core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isFunction } from '@polkadot/util/is/function';

import { RpcErrorInterface } from './types/error';

const UNKNOWN = -99999;

function extend (that: RpcError, name: string, value?: string | number): void {
  Object.defineProperty(that, name, {
    configurable: true,
    enumerable: false,
    value
  });
}

/**
 * @name RpcError
 * @summary Extension to the basic JS Error.
 * @description
 * The built-in JavaScript Error class is extended by adding a code to allow for Error categorization. In addition to the normal `stack`, `message`, the numeric `code` and `data` (any types) parameters are available on the object.
 * @example
 * <BR>
 *
 * ```javascript
 * const { RpcError } from '@polkadot/util');
 *
 * throw new RpcError('some message', RpcError.CODES.METHOD_NOT_FOUND); // => error.code = -32601
 * ```
 */
export default class RpcError extends Error implements RpcErrorInterface {
  public code!: number;

  public data?: number | string;

  public override message!: string;

  public override name!: string;

  public override stack!: string;

  public constructor (message = '', code: number = UNKNOWN, data?: number | string) {
    super();

    extend(this, 'message', String(message));
    extend(this, 'name', this.constructor.name);
    extend(this, 'data', data);
    extend(this, 'code', code);

    if (isFunction(Error.captureStackTrace)) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      extend(this, 'stack', (new Error(message)).stack);
    }
  }

  public static CODES = {
    ASSERT: -90009,
    INVALID_JSONRPC: -99998,
    METHOD_NOT_FOUND: -32601, // Rust client
    UNKNOWN
  };
}