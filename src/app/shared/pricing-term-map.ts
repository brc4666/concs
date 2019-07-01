import { PayableRule } from '../models/payable-rule';
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
    static PayableRule: IPricingConditionModel<any>;
    static Penalty: IPricingConditionModel<any>;
}

export interface IPricingTermModel<T> extends IDataBaseModel<T>, IViewable<T> {
}

export interface IPricingConditionModel<T> extends IViewable<T> {}

export interface IPricingTerm {
    tradeId: string;
}
