import { TableMap } from '../shared/table-map';
import { IDataBaseObj } from './_base';

export interface IPenalty extends IDataBaseObj {
    element?: string;
    tradeId?: string;
    type?: string;
    currency?: string;
    penaltyUnit?: string;
    thresholdUnit?: string;
    basis?: string;
}

export interface IPenaltyCondition {
    amount: number;
    threshold: number;
    operator: string;
    tier: number;
}

export class Penalty {
    static tableName: string = TableMap.Penalties;
    static fieldDefs = [
        {name: 'element', label: 'Element'},
        {name: 'type', label: 'Type'},
        {name: 'currency', label: 'Currency'},
        {name: 'penaltyUnit', label: 'Penalty Units'},
        {name: 'thresholdUnit', label: 'Threshold Units'},
        {name: 'basis', label: 'Basis'}
    ];
    static viewTitle = 'Penalties';
    static conditional = true;

    id: string;
    element: string;
    tradeId: string;
    type: string;
    currency: string;
    penaltyUnit: string;
    thresholdUnit: string;
    basis: string;

    constructor(props: IPenalty) {
        // TODO sort out this mess
        Object.keys(props).forEach(
            prop => {
                if (Array.isArray(props[prop])) {
                    const arrayProp = props[prop];
                    this[prop] = arrayProp.map(element => new PenaltyCondition(element));
                } else {
                    this[prop] = props[prop];
                }
            }
        );
    }
}

export class PenaltyCondition {
    static fieldDefs: [
        {name: 'amount', label: 'Amount'},
        {name; 'threshold', label: 'Threshold'},
        {name: 'operator', label: 'Operator'},
        {name: 'tier', label: 'Tier'}
    ]
    static viewTitle = 'Penalty Conditions';

    constructor(props: IPenaltyCondition) {
        Object.keys(props).forEach(
            prop => this[prop] = props[prop]
        )
    }
}

