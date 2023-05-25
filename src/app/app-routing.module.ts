import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/LoginPage/login-page.component';
import { SignUpComponent } from './Components/SignUpPage/signup-page.component'
import { CustomerPageComponent } from './Components/CustomerPage/CustomerPage.component';
import { AdminPageComponent } from './Components/AdminPage/AdminPage.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'CustomerPage', component: CustomerPageComponent },
  { path: 'AdminPage', component: AdminPageComponent },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
