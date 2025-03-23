import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './app/pages/auth/auth-guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
        ]
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        component: AppLayout,
        children: [
            { path: '', loadChildren: () => import('./app/pages/admin/admin.routes') },
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
