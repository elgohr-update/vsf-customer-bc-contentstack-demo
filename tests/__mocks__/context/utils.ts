type Unshift<List extends any[]> = List extends [unknown, ...infer RestOfArray] ? RestOfArray : never
export type DeepPartial<Target, Iterator extends any[] = [1, 2, 3, 4, 5] > =
  Iterator['length'] extends 0 ? Target :
  Target extends keyof object ? Target :
  { [Keyname in keyof Target]?: DeepPartial<Target[Keyname], Unshift<Iterator>> };

export function markPropertiesAsNotImplemented
  <originalObject extends Record<string, any>>
(object: originalObject, notImplementedProperties: (string | number | symbol)[]): DeepPartial<originalObject> {
  return new Proxy(object, {
    get(accessedObject, accessedProperty, receiver) {
      const lacksProperty = !Reflect.has(accessedObject, accessedProperty);
      const isPropertyListedAsNotImplemented = notImplementedProperties.includes(accessedProperty.toString());
      if (lacksProperty && isPropertyListedAsNotImplemented)
        console.error(`Attempted to access ${accessedProperty.toString()}, but it's not mocked`);
      return Reflect.get(accessedObject, accessedProperty, receiver);
    }
  // Proxy typings are done poorly in TS: https://github.com/microsoft/TypeScript/pull/44458
  }) as unknown as DeepPartial<originalObject>;
}

