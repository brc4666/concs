export interface IDataBaseModel {
    tableName?: string;
}

export interface IDataBaseObj extends IDataBaseModel {
    tableName?: string;
    id: string;
}
