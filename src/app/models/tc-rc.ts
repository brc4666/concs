import { TableMap } from '../shared/table-map';
import { IDataBaseObj } from './_base';

export interface ITcRc extends IDataBaseObj {
    element?: string;
    tradeId?: string;
    type?: string;
    amount?: number;
    currency?: string;
    unit?: string;
    basis?: string;
}

export class TcRc {
    static tableName: string = TableMap.TcRcs;
    static fieldDefs = [
        {name: 'element', label: 'Element'},
        {name: 'type', label: 'Type'},
        {name: 'amount', label: 'Amount'},
        {name: 'currency', label: 'Currency'},
        {name: 'unit', label: 'Units'},
        {name: 'basis', label: 'Basis'}
    ];
    static viewTitle = 'Treatment & Refining Charges';

    id: string;
    element: string;
    tradeId: string;
    type: string;
    amount: number;
    currency: string;
    unit: string;
    basis: string;

    constructor(props: ITcRc) {
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

