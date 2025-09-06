export type CALENDAR_TYPE = 'date' | 'date-time';
export type SELECTION_MODE = 'single' | 'multiple' | null | undefined;


export type TableColumn = {
    field: string,
    header: string,
    width: string,
    sortField?: string,
    sort?: string,
    type?: TableColumnType,
    dropdown?: any,
    preventSearch?: boolean
}

export const INIT_ORDER_COLUMN: TableColumn = {
    field: 'idx',
    header: 'STT',
    width: '50px',
    sortField: 'idx',
    sort: 'none',
}

export enum TableColumnType {
    TEXT = 'text',
    DROPDOWN ='dropdown',
    DATE = 'date',
    DATERANGE = 'daterange',
    MULTISELECT = 'multiselect'
}
