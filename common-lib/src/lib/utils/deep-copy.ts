
/// @Author: Lê Hoàng Trung
/// Message: nếu value đơn giản hãy cân nhắc sử dụng JSON.parse() và JSON.stringify() thay thế

import { CommonValue } from "../constants/constant";

export function deepCopy(valueSource: any): any {
  let valueType = getValueType(valueSource);

  if (valueType === 'valuetype') {
    return valueSource;
  }

  if (valueType === CommonValue.ReferenceTypeEnum.DATE)
    return valueSource;

  if (valueType === CommonValue.ReferenceTypeEnum.ARRAY)
    return deepCopyArray(valueSource);

  if (valueType === CommonValue.ReferenceTypeEnum.OBJECT)
    return deepCopyObject(valueSource);

  console.error('Giá trị ' + valueSource + ' có kiểu dữ liệu không hợp lệ');
  return undefined;
}

export function deepCopyObject(valueSource: any) {
  const copy: { [key: string]: any } = {};
  for (const key in valueSource) {
    copy[key] = deepCopy(valueSource[key]);
  }
  return copy;
}

export function deepCopyArray(valueSource: any) {
  const valueTarget: any[] = [];
  for (let i = 0; i < valueSource.length; i++) {
    valueTarget[i] = deepCopy(valueSource[i]);
  }
  return valueTarget;
}

export function isNotReferenceType(value: any) {
  return CommonValue.ValueType.includes(typeof value) ? true : false;
}

export function getValueType(value: any) {
  if (isNotReferenceType(value)) {
    return 'valuetype';
  }
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  if (value instanceof RegExp) return 'regexp';
  if (value instanceof Map) return 'map';
  if (value instanceof Set) return 'set';
  if (value instanceof WeakMap) return 'weakmap';
  if (value instanceof WeakSet) return 'weakset';
  if (value instanceof Promise) return 'promise';
  if (value instanceof Error) return 'error';
  if (typeof value === 'object') return 'object';
  return 'unknown';
}

