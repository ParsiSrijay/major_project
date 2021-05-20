import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { RouterModule, Routes } from '@angular/router';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [ { path: '', component: LoginComponent }];

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    RouterModule.forRoot(routes),
  ],
  bootstrap: [AppComponent],
  declarations: [LoginComponent],
})
export class AppServerModule {}