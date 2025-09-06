import { Injectable } from "@angular/core";
import { StorageKeys } from "../constants/constant";
import { IAuthModel } from "../models/auth-model";
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  getUserPermissions(): string[] {
    const userJSON = localStorage.getItem(StorageKeys.USER);
    if (userJSON) {
      const userObject = JSON.parse(userJSON) as IAuthModel;
      return userObject.roles ? userObject.roles : [];
    } else {
      return [];
    }
  }
  hasPermission(permission: string): boolean {
    return this.getUserPermissions().includes(permission);
  }
  containPermissions(permissions: string[]): boolean {
    if (permissions && permissions.some(e => this.getUserPermissions().includes(e))) {
      return true;
    }
    return false;
  }
  getUserId(): string {
    const storedPermissions = localStorage.getItem(StorageKeys.USER);
    return storedPermissions ? JSON.parse(storedPermissions).userId : "";
  }
  hasLogin(){
    return localStorage.getItem(StorageKeys.TOKEN);
  }
}
