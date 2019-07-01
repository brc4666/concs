import { PayableRule, PayableRuleCondition } from '../models/payable-rule';
import { TcRc } from '../models/tc-rc';
import { Penalty } from '../models/penalty';
import { Compensation } from '../models/compensation';
import { IDataBaseModel, IViewable } from '../models/_base';

export class PricingTermModels {
    static PayableRule: IPricingTermModel<any> = PayableRule;
    static TcRc: IPricingTermModel<any> = TcRc;
    static Penalty: IPricingTermModel<any>  = Penalty;
    static Compensation: IPricingTermModel<any>  = Compensation;
}

export class ConditionalPricingModels {
    static PayableRule: IConditionalModelDef<any> = {parent: PayableRule, child: PayableRuleCondition};
    static Penalty: IConditionalModelDef<any> = {parent: PayableRule, child: PayableRuleCondition};
}

export interface IPricingTermModel<T> extends IDataBaseModel<T>, IViewable<T> {
}

export interface IPricingConditionModel<T> extends IViewable<T> {}

export interface IPricingTerm {
    tradeId: string;
}

export interface IConditionalModelDef<T> {
    parent: IPricingTermModel<T>;
    child: IPricingConditionModel<T>;
}
