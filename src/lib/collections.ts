export module Collections {

    export interface IDictionary<T extends number | string, U> {
        add(key: T, value: U): boolean;
        remove(key: T): boolean;
        containsKey(key: T): boolean;
        getValue(key: T): U
        keys(): T[];
        values(): U[];
        count(): number;
    }

    export class Dictionary<T extends number | string, U>{
        protected _keys: T[] = [];
        protected _values: U[] = [];

        protected undefinedKeyErrorMessage: string = "Key is either undefined, null or an empty string.";

        protected isEitherUndefinedNullOrStringEmpty(object: any): boolean {
            return (typeof object) === "undefined" || object === null || object.toString() === "";
        }

        protected checkKeyAndPerformAction(action: { (key: T, value?: U): void | U | boolean }, key: T, value?: U): void | U | boolean {

            if (this.isEitherUndefinedNullOrStringEmpty(key)) {
                throw new Error(this.undefinedKeyErrorMessage);
            }

            return action(key, value);
        }


        public add(key: T, value: U): void {

            var addAction = (key: T, value: U): void => {
                if (this.containsKey(key)) {
                    throw new Error("An element with the same key already exists in the dictionary.");
                }

                this._keys.push(key);
                this._values.push(value);
            };

            this.checkKeyAndPerformAction(addAction, key, value);
        }

        public remove(key: T): boolean {

            var removeAction = (key: T): boolean => {
                if (!this.containsKey(key)) {
                    return false;
                }

                var index = this._keys.indexOf(key);
                this._keys.splice(index, 1);
                this._values.splice(index, 1);

                return true;
            };

            return <boolean>(this.checkKeyAndPerformAction(removeAction, key));
        }

        public getValue(key: T): U {

            var getValueAction = (key: T): U => {
                if (!this.containsKey(key)) {
                    return null;
                }

                var index = this._keys.indexOf(key);
                return this._values[index];
            }

            return <U>this.checkKeyAndPerformAction(getValueAction, key);
		}
		
		public hasValue(value: U): boolean {
			 
			var hasValueAction = (value: U): boolean => {
                console.log(value);
                console.log(this._values);				
				return this._values.some(x => x == value);
			}

			return <boolean>hasValueAction(value);
        }
        
        public hasJsonValue(value: U, key: string): boolean {
			 
			var hasValueAction = (value: U, key: string): boolean => {
                console.log(key);				
				return this._values.some(function(x) {
                    console.log(x[key]);
                    console.log(value[key]);
                    return x[key] == value[key];
                });
			}

			return <boolean>hasValueAction(value, key);
        }

        public containsKey(key: T): boolean {

            var containsKeyAction = (key: T): boolean => {
                if (this._keys.indexOf(key) === -1) {
                    return false;
                }
                return true;
            };

            return <boolean>this.checkKeyAndPerformAction(containsKeyAction, key);
        }

        public changeValueForKey(key: T, newValue: U): void {

            var changeValueForKeyAction = (key: T, newValue: U): void => {
                if (!this.containsKey(key)) {
                    throw new Error("In the dictionary there is no element with the given key.");
                }

                var index = this._keys.indexOf(key);
                this._values[index] = newValue;
            }

            this.checkKeyAndPerformAction(changeValueForKeyAction, key, newValue);
        }

        public keys(): T[] {
            return this._keys;
        }

        public values(): U[] {
            return this._values;
        }

        public count(): number {
            return this._values.length;
        }
    }

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
}