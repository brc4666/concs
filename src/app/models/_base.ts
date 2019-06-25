export interface IDataBaseModel<T> {
    new(...args: any[]): T;
    tableName: string;
}

export interface IDataBaseObj {
    id: string;
}
