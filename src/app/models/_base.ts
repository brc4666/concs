export interface IDataBaseModel<T> {
    // The constructor 'new' in the interface implies tableName is a static property on the class T
    new(...args: any[]): T;
    tableName: string;
}

export interface IDataBaseObj {
    id: string;
}

export interface IViewable<T> {
    new(...args: any[]): T;
    fieldDefs: IFieldDef[];
}

export interface IFieldDef {
    name: string;
    label?: string;
}
