import { TableMap } from '../shared/table-map';
import { IDataBaseObj, IFieldDef } from './_base';

export interface IPayableRule extends IDataBaseObj {
    element?: string;
    tradeId?: string;
    ruleType?: string;
    unit?: string;
    conditions?: IPayableRuleCondition[];
}

export interface IPayableRuleCondition {
    payableContent?: number;
    minDeduction?: number;
    threshold?: number;
    operator?: string;
}

export class PayableRule implements IPayableRule {
    static tableName: string = TableMap.PayableRules;
    static fieldDefs = [
        {name: 'element', label: 'Element', editable: true},
        {name: 'ruleType', label: 'Rule Type', editable: true},
        {name: 'unit', label: 'Units', editable: true}
    ];
    static conditionalFieldDefs = [
        {name: 'payableContent', label: 'Payable Content'},
        {name: 'minDeduction', label: 'Min. Deduction'}
    ];
    static viewTitle = 'Payable Rules';
    static conditional = true;

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
                    this[prop] = arrayProp.map(element => new PayableRuleCondition(element));
                } else {
                    this[prop] = props[prop];
                }
            }
        );
    }
}

export class PayableRuleCondition {
    static fieldDefs: [
        {name: 'payableContent', label: 'Payable Content', editable: true},
        {name: 'minDeduction', label: 'Min. Deduction', editable: true},
        {name: 'threshold', label: 'Threshold'},
        {name: 'operator', label: 'Operator'}
    ];
    static viewTitle = 'Payable Rule Conditions';

    constructor(props: IPayableRuleCondition) {
        Object.keys(props).forEach(
            prop => this[prop] = props[prop]
        );
    }
}