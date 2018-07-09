import { JsValue, Json } from "ts-json-definition";
import { Optional, Either } from "scalts";
import UnmarshallError from "../errors/UnmarshallError";
export declare type Marshaller<T> = (value: T, json: Json, clazz: any, classPropertyName: string, jsonPropertyName: string, target: Function, mbType: Optional<Function>) => JsValue;
export declare type Unmarshaller<T> = (value: JsValue, json: Json, clazz: any, classPropertyName: string, jsonPropertyName: string, target: Function, mbType: Optional<Function>, jsonPath: string[], classPath: string[]) => Either<UnmarshallError[], T>;
export declare const defaultMarshaller: Marshaller<any>;
export declare const defaultUnmarshaller: Unmarshaller<any>;
