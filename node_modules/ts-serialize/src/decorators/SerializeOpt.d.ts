import { Unmarshaller, Marshaller } from "../transformers";
declare const SerializeOpt: <T>(type: Function, jsonPropertyName?: string | undefined, unmarshaller?: Unmarshaller<T>, marshaller?: Marshaller<T>) => (target: any, classPropertyName: string) => void;
export default SerializeOpt;
