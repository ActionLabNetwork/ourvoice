export declare type JSONPrimitive = string | number | boolean | null;
export declare type JSONArray = Array<JSONValue>;
export declare type JSONValue =
  | JSONPrimitive
  | JSONObject
  | JSONArray
  | undefined;
export interface JSONObject {
  [ind: string]: JSONValue;
}

export type Metadata = JSONObject;
