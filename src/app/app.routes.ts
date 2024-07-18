import { Routes } from '@angular/router';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { UserinputComponent } from './userinput/userinput.component';
import { UserprogressComponent } from './userprogress/userprogress.component';

export const routes: Routes = [
  { path: '', redirectTo: '/userinput', pathMatch: 'full' },
  { path: 'userinput', component: UserinputComponent },
  { path: 'userinfo', component: UserinfoComponent },
  { path: 'userprogress', component: UserprogressComponent },
];
