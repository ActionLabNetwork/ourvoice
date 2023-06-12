declare type JSONPrimitive = string | number | boolean | null;
declare type JSONArray = Array<JSONValue>;
declare type JSONValue = JSONPrimitive | JSONObject | JSONArray | undefined;
interface JSONObject {
  [ind: string]: JSONValue;
}

export type Metadata = JSONObject;

export class UpdateMetadataDto implements Metadata {
  [ind: string]: JSONValue;
  deployment?: string;
  consent?: string;
}
