"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Collections;
(function (Collections) {
    class Dictionary {
        constructor() {
            this._keys = [];
            this._values = [];
            this.undefinedKeyErrorMessage = "Key is either undefined, null or an empty string.";
        }
        isEitherUndefinedNullOrStringEmpty(object) {
            return (typeof object) === "undefined" || object === null || object.toString() === "";
        }
        checkKeyAndPerformAction(action, key, value) {
            if (this.isEitherUndefinedNullOrStringEmpty(key)) {
                throw new Error(this.undefinedKeyErrorMessage);
            }
            return action(key, value);
        }
        add(key, value) {
            var addAction = (key, value) => {
                if (this.containsKey(key)) {
                    throw new Error("An element with the same key already exists in the dictionary.");
                }
                this._keys.push(key);
                this._values.push(value);
            };
            this.checkKeyAndPerformAction(addAction, key, value);
        }
        remove(key) {
            var removeAction = (key) => {
                if (!this.containsKey(key)) {
                    return false;
                }
                var index = this._keys.indexOf(key);
                this._keys.splice(index, 1);
                this._values.splice(index, 1);
                return true;
            };
            return (this.checkKeyAndPerformAction(removeAction, key));
        }
        getValue(key) {
            var getValueAction = (key) => {
                if (!this.containsKey(key)) {
                    return null;
                }
                var index = this._keys.indexOf(key);
                return this._values[index];
            };
            return this.checkKeyAndPerformAction(getValueAction, key);
        }
        hasValue(value) {
            var hasValueAction = (value) => {
                console.log(value);
                console.log(this._values);
                return this._values.some(x => x == value);
            };
            return hasValueAction(value);
        }
        hasJsonValue(value, key) {
            var hasValueAction = (value, key) => {
                console.log(key);
                return this._values.some(function (x) {
                    console.log(x[key]);
                    console.log(value[key]);
                    return x[key] == value[key];
                });
            };
            return hasValueAction(value, key);
        }
        containsKey(key) {
            var containsKeyAction = (key) => {
                if (this._keys.indexOf(key) === -1) {
                    return false;
                }
                return true;
            };
            return this.checkKeyAndPerformAction(containsKeyAction, key);
        }
        changeValueForKey(key, newValue) {
            var changeValueForKeyAction = (key, newValue) => {
                if (!this.containsKey(key)) {
                    throw new Error("In the dictionary there is no element with the given key.");
                }
                var index = this._keys.indexOf(key);
                this._values[index] = newValue;
            };
            this.checkKeyAndPerformAction(changeValueForKeyAction, key, newValue);
        }
        keys() {
            return this._keys;
        }
        values() {
            return this._values;
        }
        count() {
            return this._values.length;
        }
    }
    Collections.Dictionary = Dictionary;
    /*export class MatchDictionary<T extends number | string, U, I extends string> extends Dictionary<T extends number | string, U>(T: string, U: U)  {
        private _sockets: I[] = [];

        constructor(){
            super();
        }

        public setSockets(sockets: I[]): void {

            var addAction = (sockets: I[]): void => {
                if (this.containsSocket(sockets)) {
                    throw new Error("An element with the same key already exists in the dictionary.");
                }

                sockets.forEach(el => {
                    this._sockets.push(el);
                })
            };

            if ((typeof this._sockets) === "undefined" || this._sockets === null || this._sockets.toString() === "") {
                throw new Error(this.undefinedKeyErrorMessage);
            }

            addAction(sockets);
        }

        public containsSocket(sockets: I[]): boolean {

            var containsSocketAction = (sockets: I[]): boolean => {
                sockets.forEach(element => {
                    if (this._sockets.indexOf(element) === -1) {
                        return false;
                    }
                    return true;
                });
                
                return false;
            };

            return <boolean>containsSocketAction(sockets);
        }

        public removeMatchBySocket(socket:I): boolean {
            
            this._sockets.forEach(el => {
               if(el.indexOf(socket))
               {
                    let index = this._sockets.indexOf(el);
                    this._sockets.splice(index, 1);
                    this._keys.splice(index, 1);
                    this._values.splice(index,1 );
                    return true;
               }
            })

            return false;
        }
    }*/
})(Collections = exports.Collections || (exports.Collections = {}));
