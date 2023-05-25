import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/LoginPage/login-page.component';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './api/services/user.service';
import { ItemService } from './api/services/item.service';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './Components/SignUpPage/signup-page.component';
import { AdminPageComponent } from './Components/AdminPage/AdminPage.component';
import { IngredienService } from './api/services/ingrediente.service';
import { ComandaService } from './api/services/comanda.service';
import { CommonModule } from '@angular/common';
import { CustomerPageComponent } from './Components/CustomerPage/CustomerPage.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    AdminPageComponent,
    CustomerPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule

  ],
  providers: [UserService, ItemService, IngredienService, ComandaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
