export interface IAuthModel {
    id?: number;
    username?: string;
    avatar?: string;
    menus?: any[];
    roles?: string[];
    fullname?: string;
}
export const INIT_AUTH_MODEL: IAuthModel = {
    id: 1,
    username: '',
    avatar: '',
    menus: [],
    roles: [],
    fullname: ''
};
