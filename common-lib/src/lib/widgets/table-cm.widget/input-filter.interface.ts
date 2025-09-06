export interface InputFilter {
  pageNumber: number,
  pageSize: number,
  first : number,
  sortField? : string,
  sortOrder? : string,
  dataSearch : any; 
}