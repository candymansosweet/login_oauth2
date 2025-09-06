import { Injectable, signal, computed, effect, EffectRef } from '@angular/core';
import { IAuthModel, INIT_AUTH_MODEL } from '../models/auth-model';
import { StorageKeys } from '../constants/constant';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly _authSignal = signal<IAuthModel>(this.getInitialAuth());

  readonly auth = computed(() => this._authSignal());

  constructor() {
    effect(() => {
      localStorage.setItem(StorageKeys.USER, JSON.stringify(this._authSignal()));
    });
  }

  private getInitialAuth(): IAuthModel {
    try {
      const raw = localStorage.getItem(StorageKeys.USER);
      if (!raw) return structuredClone(INIT_AUTH_MODEL);
      return JSON.parse(raw);
    } catch {
      return structuredClone(INIT_AUTH_MODEL);
    }
  }

  dispatch(payload: Partial<IAuthModel> | null): void {
    if (!payload) return;
    const updated = { ...this._authSignal(), ...payload };
    this._authSignal.set(updated);
  }

  onChange(callback: (auth: IAuthModel) => void): EffectRef {
    return effect(() => {
      callback(this._authSignal());
    });
  }
}
