[![Build Status](https://travis-ci.org/thomaswinckell/scalts-array.svg?branch=master)](https://travis-ci.org/thomaswinckell/scalts-array) [![npm version](https://img.shields.io/npm/v/scalts-array.svg?style=flat)](https://www.npmjs.com/package/scalts-array)[![Test Coverage](https://codeclimate.com/github/thomaswinckell/scalts-array/badges/coverage.svg)](https://codeclimate.com/github/thomaswinckell/scalts-array/coverage)

## scalts-array

Array enrichment based on lodash for Typescript and scalts.


### Requirements

* [TypeScript v2](https://www.typescriptlang.org/#download-links)
* [Scalts](https://github.com/dohrm/scalts)

### Documentation

Mostly, see lodash documentation :

https://lodash.com/docs/4.16.4

The methods that are not documented on lodash are just classic EcmaScript or lodash methods with scalts Optional support. They are suffixed by ```Opt``` like for instance ```indexOfOpt``` or ```findOpt```.


### Usage

```
import 'scalts-array'
```


### Supported methods

Supported methods for an array of type T

    chunk(size ?: number) : Array<Array<T>>;
    compact() : Array<T>;
    copy() : Array<T>;
    difference(...values : Array<any>) : Array<T>;
    differenceBy(values : Array<Array<T>>, iteratee : ((value:T) => any)|string) : Array<T>;
    differenceWith(values : Array<Array<T>>, comparator : (value1:T, value2:T) => boolean) : Array<T>;
    distinct : Array< T >;
    drop(n : number) : Array<T>;
    dropRight(n : number) : Array<T>;
    dropRightWhile(predicate : (value : T, index : number, array : Array<T>) => boolean) : Array<T>;
    dropWhile(predicate : (value : T, index : number, array : Array<T>) => boolean) : Array<T>;
    exists(predicate : (value : T, index : number, array : Array<T>) => boolean) : boolean;
    findOpt(predicate : (value : T, index : number, array : Array<T>) => boolean) : Optional<T>;
    findIndexOpt(predicate : (value : T) => boolean) : Optional<number>;
    findLastIndexOpt(predicate : (value : T) => boolean) : Optional<number>;
    flatten<U>() : Array<U>;
    flatMap(predicate : (value : T) => Array<T>) : Array<T>;
    head : Optional<T>;
    indexOfOpt(value: T, fromIndex ?: number) : Optional<number>;
    initial : Array<T>;
    intersection(...values: Array<Array<T>>) : Array<T>;
    intersectionBy(values: Array<Array<T>>, iteratee : ((value : T) => any)|string) : Array<T>;
    intersectionWith(values : Array<Array<T>>, comparator : (value1:T, value2:T) => boolean) : Array<T>;
    isEmpty : boolean;
    last : Optional<T>;
    lastIndexOfOpt(value: T, fromIndex ?: number) : Optional<number>;
    reversed : Array< T >;
    sortBy(iteratee : ((value : T) => any)|string[]) : Array<T>;
    tail : Array<T>;
    take(n ?: number) : Array<T>;
    takeRight(n ?: number) : Array<T>;
    takeRightWhile(predicate : (value : T) => boolean) : Array<T>;
    takeWhile(predicate : (value : T) => boolean) : Array<T>;


