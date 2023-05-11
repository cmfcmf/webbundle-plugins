/*!
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { KeyObject } from 'crypto';
import { FormatVersion } from './wbn-types';

export interface Headers {
  [key: string]: string;
}

interface IbSignOptionsWithKey {
  key: KeyObject;
  isIwa?: boolean;
}

// TODO(sonkkeli): Move to the follow-up PR.
// interface IbSignOptionsWithStrategy {
//   strategy: ISigningStrategy;
//   key?: KeyObject;
//   isIwa?: boolean;
// }

interface PluginOptionsBase {
  static: { dir: string; baseURL?: string };
  baseURL?: string;
  output?: string;
  formatVersion?: FormatVersion;
  headerOverride?: (() => Headers) | Headers;
}

interface ValidPluginOptionsBase extends PluginOptionsBase {
  baseURL: string;
  output: string;
  formatVersion: FormatVersion;
}

export interface NonIbSignPluginOptions extends PluginOptionsBase {
  primaryURL?: string;
}

export interface ValidNonIbSignPluginOptions extends ValidPluginOptionsBase {
  primaryURL?: string;
}

// As TypeScript is only able to check that the wanted properties exist, but not
// that unwanted don't exist, we need to keep track of the unwanted properties
// manually to make sure that possible existence of them is not ignored nor
// incorrectly typed.
const IB_SIGN_UNWANTED_PROPS = ['primaryURL'];
const NON_IB_SIGN_UNWANTED_PROPS = ['integrityBlockSign'];

export interface IbSignPluginOptions extends PluginOptionsBase {
  integrityBlockSign: IbSignOptionsWithKey;
}

export interface ValidIbSignPluginOptions extends ValidPluginOptionsBase {
  // TODO(sonkkeli): Replace with IbSignOptionsWithStrategy in the follow-up PR.
  integrityBlockSign: IbSignOptionsWithKey;
}

export type PluginOptions = NonIbSignPluginOptions | IbSignPluginOptions;

export type ValidPluginOptions =
  | ValidNonIbSignPluginOptions
  | ValidIbSignPluginOptions;

export function isIbSignPluginOptions(
  opts: PluginOptions
): opts is IbSignPluginOptions {
  return (opts as IbSignPluginOptions).integrityBlockSign !== undefined;
}

export function isValidNonIbSignPluginOptions(
  opts: PluginOptions | ValidPluginOptions
): opts is ValidNonIbSignPluginOptions {
  if (NON_IB_SIGN_UNWANTED_PROPS.every((o) => o in opts)) {
    return false;
  }

  const forceTypedObject = opts as ValidNonIbSignPluginOptions;
  return (
    forceTypedObject.baseURL !== undefined &&
    forceTypedObject.output !== undefined &&
    forceTypedObject.formatVersion !== undefined
  );
}

export function isValidIbSignPluginOptions(
  opts: PluginOptions | ValidPluginOptions
): opts is ValidIbSignPluginOptions {
  if (IB_SIGN_UNWANTED_PROPS.every((o) => o in opts)) {
    return false;
  }

  const forceTypedObject = opts as ValidIbSignPluginOptions;
  return (
    forceTypedObject.integrityBlockSign !== undefined &&
    forceTypedObject.baseURL !== undefined &&
    forceTypedObject.output !== undefined &&
    forceTypedObject.formatVersion !== undefined &&
    // TODO(sonkkeli): Replace with integrityBlockSign.strategy in the follow-up PR.
    forceTypedObject.integrityBlockSign.key !== undefined
  );
}
