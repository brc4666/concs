export interface StaticMethods<T> {
    // The constructor 'new' in the interface implies tableName is a static property on the class T
    new(...args: any[]): T;
}

export interface IDataBaseModel<T> extends StaticMethods<T> {
    tableName: string;
}

export interface IDataBaseObj {
    id: string;
}

export interface IViewable<T> extends StaticMethods<T> {
    fieldDefs: IFieldDef[];
    viewTitle: string;
}

export interface IFieldDef {
    name: string;
    label?: string;
    editable?: boolean;
}
