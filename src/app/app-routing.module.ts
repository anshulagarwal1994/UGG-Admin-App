import { SignUpInvitationComponent } from './components/sign-up-invitation/sign-up-invitation.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSerializer } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: 'SignUpInvitation',
    component: SignUpInvitationComponent,
  },
  {
    path: '*',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      initialNavigation: !isIframe ? 'enabled' : 'disabled',
      scrollPositionRestoration: 'top',
      paramsInheritanceStrategy: 'always',
      relativeLinkResolution: 'corrected',
      malformedUriErrorHandler: (
        error: URIError,
        urlSerializer: UrlSerializer,
        url: string
      ) => urlSerializer.parse('/dashboard'),
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
