/// <reference types="vite/client" />

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

interface JSONObject {
  [k: string]: JSONValue;
}
type JSONArray = Array<JSONValue>;

interface HTMLElement {
  clickOutsideEvent: (e: any) => void;
}
