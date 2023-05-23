import { Component, OnInit } from '@angular/core';
import { Tenant } from '@app/models/tenant.model';
import { Site } from 'src/app/models/site.model';
import { HttpDataService } from '@app/shared/services/http-data.service';
import { AppConstants } from '@app/constants';
import { PopUpService } from '@app/shared/utility/popup.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
})
export class TransferComponent implements OnInit {

  tenants: Tenant[];
  tenantsTo: Tenant[];
  sites: Site[];
  selectedFromTenant: any = '';
  selectedToTenant: any = '';
  selectedSite: any = '';

  constructor(
    private httpDataService: HttpDataService,
    private popUpService: PopUpService
  ) {}

  ngOnInit(): void {
    this.getTenantNames();
  }

  SortArray(a: Tenant, b: Tenant) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  getTenantNames() {
    return this.httpDataService
      .get(AppConstants.APIUrlTenantNameListtUrl)
      .subscribe((res: Tenant[]) => {
        this.tenants = res.sort(this.SortArray);
      });
  }

  tenantFromSelection(tenant: any) {
    this.selectedToTenant = '';
    let tList: any = [];
    this.tenants.forEach((t: any) => {
      if (t.tenantId !== tenant.tenantId) {
        tList.push(t);
      }
    });
    this.tenantsTo = tList.sort(this.SortArray);
    this.httpDataService
      .get(AppConstants.APIUrlGetSites + tenant.tenantId + '/' + false)
      .subscribe(
        (res) => {
          this.sites = res;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  transfer() {
    this.httpDataService
      .put(
        AppConstants.APIUrlTenantTransfer +
          this.selectedFromTenant.tenantId +
          '/' +
          this.selectedToTenant.tenantId +
          '/' +
          this.selectedSite.siteId,
        {}
      )
      .subscribe(
        (res: any) => {
          this.selectedFromTenant = '';
          this.selectedToTenant = '';
          this.selectedSite = '';
          this.popUpService.showMsg(
            'Site Transferred.',
            AppConstants.EmptyUrl,
            AppConstants.Success,
            AppConstants.Success
          );
        },
        (err: any) => {
          this.popUpService.showMsg(
            'Site Transfer Error',
            AppConstants.EmptyUrl,
            AppConstants.Error,
            AppConstants.Error
          );
        }
      );
  }
}
