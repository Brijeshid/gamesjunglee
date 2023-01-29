import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
  },

  {
    path: '',
    loadChildren: () => import('./features/in-play/in-play.module').then((m) => m.InPlayModule)
  },

  {
    path: '',
    loadChildren: () => import('./features/sports-book/sports-book.module').then((m) => m.SportsBookModule)
  },

  {
    path: '',
    loadChildren: () => import('./features/user-settings/user-settings.module').then((m) => m.UserSettingsModule)
  },

  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
