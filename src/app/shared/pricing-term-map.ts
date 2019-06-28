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

export interface IPricingTermModel<T> extends IDataBaseModel<T>, IViewable<T> {
    conditional?: boolean;
}

export interface IPricingTerm {
    tradeId: string;
}
