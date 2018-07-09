import { Unmarshaller, Marshaller } from "../transformers";
export declare const SerializeArray: <T>(type: Function, jsonPropertyName?: string | undefined, unmarshaller?: Unmarshaller<T>, marshaller?: Marshaller<T>) => (target: any, classPropertyName: string) => void;
export default SerializeArray;
