import { Optional } from "scalts";
import { Unmarshaller, Marshaller } from "../transformers";
declare function Serialize<T>(mbJsonPropertyName?: string, unmarshaller?: Unmarshaller<T>, marshaller?: Marshaller<T>, mbGivenType?: Optional<any>): (target: any, classPropertyName: string) => void;
export default Serialize;
