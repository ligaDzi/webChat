import { OrderedMap, Map } from 'immutable'

export const arrToMap = (arr, Model = Map) => {

    return arr.reduce(
        (acc, item) => acc.set( item.id, new Model(item) ),
        new OrderedMap({})
    );
}

export const mapToArr = map => {

    return map.valueSeq().toArray();
}

export const getRandomId = () => `${Math.random().toString()}${Date.now().toString()}`