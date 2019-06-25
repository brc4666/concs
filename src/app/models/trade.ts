import { IDataBaseObj, IDataBaseModel } from './_base';
import { TableMap } from '../shared/table-map';

export interface ITrade {
    productName?: string;
}

export class Trade implements ITrade {
    static tableName: string = TableMap.Trades;

    id: string;

    productName: string;

    constructor(props: ITrade) {
        Object.keys(props).map(
            prop => this[prop] = props[prop]
        );
    }
}

