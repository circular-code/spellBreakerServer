import FieldSerializer from "./FieldSerializer";
declare namespace SerializersMapper {
    function getFieldSerializers(target: Object): FieldSerializer[];
    function registerField(target: Object, field: FieldSerializer): void;
}
export default SerializersMapper;
