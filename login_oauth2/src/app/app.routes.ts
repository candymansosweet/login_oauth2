import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgotpassword',
        loadComponent: () => import('./components/forgotpassword/forgotpassword.component').then(m => m.ForgotpasswordComponent)
      },
    ]
  },
  {
    path: 'home',
    loadComponent: () => import('./layout/components/app.layout').then(m => m.AppLayout),
    children: [
      {
        path: 'application',
        loadComponent: () => import('./components/application/application.component').then(m => m.ApplicationComponent)
      }
    ]
  }
];
