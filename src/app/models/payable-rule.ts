import { TableMap } from '../shared/table-map';
import { IDataBaseObj } from './_base';

export interface IPayableRule extends IDataBaseObj {
    element?: string;
    tradeId?: string;
    ruleType?: string;
    unit?: string;
    conditions?: IPayableRuleCondition[];
}

export interface IPayableRuleCondition {
    payableContent: number;
    minDeduction: number;
}

export class PayableRule implements IPayableRule {
    static tableName: string = TableMap.PayableRules;

    id: string;
    element: string;
    tradeId: string;
    ruleType: string;
    unit: string;
    conditions: IPayableRuleCondition[];

    constructor(props: IPayableRule) {
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

