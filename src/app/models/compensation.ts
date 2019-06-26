import { TableMap } from '../shared/table-map';
import { IDataBaseObj } from './_base';

export interface ICompensation extends IDataBaseObj {
    amount?: number;
    currency?: string;
    description?: string;
}

export class Compensation {
    static tableName: string = TableMap.Compensations;
    static fieldDefs = [
        {name: 'amount', label: 'Amount'},
        {name: 'currency', label: 'Currency'},
        {name: 'description', label: 'Description'}
    ];

    id: string;
    tradeId: string;
    amount: number;
    currency: string;
    description: string;

    constructor(props: ICompensation) {
        // TODO sort out this mess
        Object.keys(props).forEach(
            prop => {
                if (Array.isArray(props[prop])) {
                    const arrayProp = props[prop];
                    this[prop] = arrayProp.map(element => Object.assign({}, element));
                } else {
                    this[prop] = props[prop];
                }
            }
        );
    }
}

