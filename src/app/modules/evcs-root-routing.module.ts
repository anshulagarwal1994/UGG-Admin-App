import { AuthGuard } from '@app/shared/services/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ChargerCreationComponent } from './features/charger-creation/charger-creation.component';
import { ChargerEditComponent } from './features/charger-edit/charger-edit.component';
import { SiteCreationComponent } from './features/site-creation/site-creation.component';
import { SiteEditComponent } from './features/site-edit/site-edit.component';
import { PromoCodeComponent } from './features/promo-code/promo-code.component';
import { PromoCodeDetailsComponent } from './features/promo-code-details/promo-code-details.component';
import { TenantEditComponent } from './features/tenant-edit/tenant-edit.component';
import { EVCSRootComponent } from './evcs-root.component';
import { TenantCreationComponent } from './features/tenant-creation/tenant-creation.component';
import { SiteDashboardComponent } from './features/site-dashboard/site-dashboard.component';
import { TransactionListComponent } from './features/transaction-list/transaction-list.component';
import { TransactionEditComponent } from './features/transaction-edit/transaction-edit.component';
import { RolesComponent } from './features/roles/roles.component';
import { UsersComponent } from './features/users/users.component';
import { UserDetailsComponent } from './features/user-details/user-details.component';
import { DeletionRequestComponent } from './features/deletion-request/deletion-request.component';
import { QueryComponent } from './features/query/query.component';
import { QueryDetailsComponent } from './features/query-details/query-details.component';
import { ConnectorsComponent } from './features/connectors/connectors.component';
import { SettingsComponent } from './features/settings/settings.component';
import { TransferComponent } from './features/transfer/transfer.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';
import { DriverRegistrationReportComponent } from './features/driver-registration-report/driver-registration-report.component';
import { NonRegisteredDriverReportComponent } from './features/non-registered-driver-report/non-registered-driver-report.component';
import { DriverActivityReportComponent } from './features/driver-activity-report/driver-activity-report.component';
import { FinancialRevenueReportComponent } from './features/financial-revenue-report/financial-revenue-report.component';
import { PromocodeDetailsReportComponent } from './features/promocode-details-report/promocode-details-report.component';
import { ChargePointUptimeReportComponent } from './features/chargepoint-uptime-report/chargepoint-uptime-report.component';
import { RegisterChargePointComponent } from './features/register-chargepoint/register-chargepoint.component';
import { TransferRequestComponent } from './features/transfer-request/transfer-request.component';

const routes: Routes = [
  {
    path: '',
    component: EVCSRootComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      {
        path: 'tenants',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'dashboard',
        component: AnalyticsComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/analytics/analytics.module').then(
            (m) => m.AnalyticsModule
          ),
      },
      {
        path: 'driver-registration-report',
        component: DriverRegistrationReportComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/driver-registration-report/driver-registration-report.module').then(
            (m) => m.DriverRegistrationReportModule
          ),
      },
      {
        path: 'non-registered-driver-report',
        component: NonRegisteredDriverReportComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/non-registered-driver-report/non-registered-driver-report.module').then(
            (m) => m.NonRegisteredDriverReportModule
          ),
      },
      {
        path: 'driver-activity-report',
        component: DriverActivityReportComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/driver-activity-report/driver-activity-report.module').then(
            (m) => m.DriverActivityReportModule
          ),
      },
      {
        path: 'financial-revenue-report',
        component: FinancialRevenueReportComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/financial-revenue-report/financial-revenue-report.module').then(
            (m) => m.FinancialRevenueReportModule
          ),
      },
      {
        path: 'promocode-details-report',
        component: PromocodeDetailsReportComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/promocode-details-report/promocode-details-report.module').then(
            (m) => m.PromocodeDetailsReportModule
          ),
      },
      {
        path: 'chargepoint-uptime-report',
        component: ChargePointUptimeReportComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/chargepoint-uptime-report/chargepoint-uptime-report.module').then(
            (m) => m.ChargePointUptimeReportModule
          ),
      },
      {
        path: 'register-chargepoint',
        component: RegisterChargePointComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/register-chargepoint/register-chargepoint.module').then(
            (m) => m.RegisterChargePointModule
          ),
      },
      {
        path: 'charger-creation',
        canActivate: [AuthGuard],
        component: ChargerCreationComponent,
        loadChildren: () =>
          import('./features/charger-creation/charger-creation.module').then(
            (m) => m.ChargerCreationModule
          ),
      },
      {
        path: 'charger-edit',
        canActivate: [AuthGuard],
        component: ChargerEditComponent,
        loadChildren: () =>
          import('./features/charger-edit/charger-edit.module').then(
            (m) => m.CharerEditModule
          ),
      },
      {
        path: 'tenant-creation',
        canActivate: [AuthGuard],
        component: TenantCreationComponent,
        loadChildren: () =>
          import('./features/tenant-creation/tenant-creation.module').then(
            (m) => m.TenantCreationModule
          ),
      },
      {
        path: 'tenant-edit',
        canActivate: [AuthGuard],
        component: TenantEditComponent,
        loadChildren: () =>
          import('./features/tenant-edit/tenant-edit.module').then(
            (m) => m.TenantEditModule
          ),
      },
      {
        path: 'site-creation',
        canActivate: [AuthGuard],
        component: SiteCreationComponent,
        loadChildren: () =>
          import('./features/site-creation/site-creation.module').then(
            (m) => m.SiteCreationModule
          ),
      },
      {
        path: 'site-edit',
        canActivate: [AuthGuard],
        component: SiteEditComponent,
        loadChildren: () =>
          import('./features/site-edit/site-edit.module').then(
            (m) => m.SiteEditModule
          ),
      },
      {
        path: 'site-dashboard',
        canActivate: [AuthGuard],
        component: SiteDashboardComponent,
        loadChildren: () =>
          import('./features/site-dashboard/site-dashboard.module').then(
            (m) => m.SiteDashboardModule
          ),
      },
      {
        path: 'roles',
        canActivate: [AuthGuard],
        component: RolesComponent,
        loadChildren: () =>
          import('./features/roles/roles.module').then((m) => m.RolesModule),
      },
      {
        path: 'users',
        canActivate: [AuthGuard],
        component: UsersComponent,
        loadChildren: () =>
          import('./features/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'user-details',
        canActivate: [AuthGuard],
        component: UserDetailsComponent,
        loadChildren: () =>
          import('./features/user-details/user-details.module').then(
            (m) => m.UserDetailsModule
          ),
      },
      {
        path: 'promo-code',
        canActivate: [AuthGuard],
        component: PromoCodeComponent,
        loadChildren: () =>
          import('./features/promo-code/promo-code.module').then(
            (m) => m.PromoCodeModule
          ),
      },
      {
        path: 'promo-code-details',
        canActivate: [AuthGuard],
        component: PromoCodeDetailsComponent,
        loadChildren: () =>
          import('./features/promo-code-details/promo-code.module').then(
            (m) => m.PromoCodeDetailsModule
          ),
      },
      {
        path: 'transaction-list',
        canActivate: [AuthGuard],
        component: TransactionListComponent,
        loadChildren: () =>
          import('./features/transaction-list/transaction-list.module').then(
            (m) => m.TransactionListModule
          ),
      },
      {
        path: 'transaction-edit',
        canActivate: [AuthGuard],
        component: TransactionEditComponent,
        loadChildren: () =>
          import('./features/transaction-edit/transaction-edit.module').then(
            (m) => m.TransactionEditModule
          ),
      },
      {
        path: 'deletion-requests',
        canActivate: [AuthGuard],
        component: DeletionRequestComponent,
        loadChildren: () =>
          import('./features/deletion-request/deletion-request.module').then(
            (m) => m.DeletionRequestModule
          ),
      },
      {
        path: 'transfer-requests',
        canActivate: [AuthGuard],
        component: TransferRequestComponent,
        loadChildren: () =>
          import('./features/transfer-request/transfer-request.module').then(
            (m) => m.TransferRequestModule
          ),
      },
      {
        path: 'query',
        canActivate: [AuthGuard],
        component: QueryComponent,
        loadChildren: () =>
          import('./features/query/query.module').then(
            (m) => m.QueryModule
          ),
      },
      {
        path: 'query-details',
        canActivate: [AuthGuard],
        component: QueryDetailsComponent,
        loadChildren: () =>
          import('./features/query-details/query-details.module').then(
            (m) => m.QueryDetailsModule
          ),
      },
      {
        path: 'connectors/:status',
        canActivate: [AuthGuard],
        component: ConnectorsComponent,
        loadChildren: () =>
          import('./features/connectors/connectors.module').then(
            (m) => m.ConnectorsModule
          ),
      },
      {
        path: 'financial',
        canActivate: [AuthGuard],
        component: SettingsComponent,
        loadChildren: () =>
          import('./features/settings/settings.module').then(
            (m) => m.SettingsModule
          ),
      },
      {
        path: 'transfer',
        canActivate: [AuthGuard],
        component: TransferComponent,
        loadChildren: () =>
          import('./features/transfer/transfer.module').then(
            (m) => m.TransferModule
          ),
      },
      {
        path: '*',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EVCSRootRoutingModule {}
