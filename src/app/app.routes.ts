import { Routes } from '@angular/router';

import { AdminPageComponent } from './features/admin/admin-page.component';
import { CustomerPageComponent } from './features/customer/customer-page.component';

export const routes: Routes = [
  { path: '', component: CustomerPageComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: '**', redirectTo: '' },
];
