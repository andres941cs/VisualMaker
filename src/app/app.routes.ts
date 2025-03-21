import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path:'', loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        // path:'dashboard', loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)component:GameComponent
        path:'dashboard', component:DashboardComponent, canActivate:[AuthGuard]
    },
    {
        path:'game', loadChildren: () => import('./game/game.routes').then(m => m.GAME_ROUTES)
    }
];
