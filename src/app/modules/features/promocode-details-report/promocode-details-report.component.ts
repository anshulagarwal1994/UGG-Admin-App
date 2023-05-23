import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import Helper from '@app/shared/utility/Helper';
import { AppConstants } from 'src/app/constants';
import { HttpDataService } from '@app/shared/services/http-data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Tenant } from '@app/models/tenant.model';
import { Site } from '@app/models/site.model';
import { ChargePoint } from '@app/models/chargepoint.model';

@Component({
  selector: 'app-promocode-details-report',
  templateUrl: './promocode-details-report.component.html',
  styleUrls: ['./promocode-details-report.component.css'],
})
export class PromocodeDetailsReportComponent {

  process = false;
  maxDate = new Date();
  tenants: Tenant[];
  sites: Site[];
  chargePoints: ChargePoint[];
  allTenantSelected = false;
  allSiteSelected = false;
  allChargePointSelected = false;
  tenantList: any;
  siteList: any;
  promocodeForm: FormGroup;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    'tenant',
    'site',
    'chargePoint',
    'customerId',
    'noofTimesUsed',
    'promocode'
  ];
  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    if (this.dataSource) {
      this.dataSource.sort = value;
    }
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private httpDataService: HttpDataService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getTenantNames();
    this.buildPromoCodeForm();
  }

  getTenantNames() {
    return this.httpDataService
      .get(AppConstants.APIUrlTenantNameListtUrl)
      .subscribe((res: Tenant[]) => {
        this.tenants = res.sort(this.SortArray);
      });
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

  buildPromoCodeForm() {
    this.promocodeForm = this.formBuilder.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      tenants: [null, [Validators.required]],
      sites: [null, [Validators.required]],
      chargePoints: [null, [Validators.required]],
    });
  }

  get startDate(): boolean {
    return !Helper.isNullOrWhitespace(
      this.promocodeForm.get('startDate')?.value
    );
  }

  get endDate(): boolean {
    return !Helper.isNullOrWhitespace(this.promocodeForm.get('endDate')?.value);
  }

  toggleAllTenantSelection() {
    this.allTenantSelected = !this.allTenantSelected;
    let tenantArray: any[] = [];
    if (this.allTenantSelected) {
      tenantArray.push('select-all');
      for (let index = 0; index < this.tenants.length; index++) {
        tenantArray.push(this.tenants[index].tenantId);
        if (this.tenants.length - 1 === index) {
          this.promocodeForm.controls['tenants'].setValue(tenantArray);
          this.getSitesFromTenants(tenantArray);
        }
      }
    } else {
      this.sites = [];
      this.chargePoints = [];
      this.promocodeForm.controls['tenants'].setValue([]);
      this.promocodeForm.controls['sites'].reset();
      this.promocodeForm.controls['chargePoints'].reset();
    }
  }

  tenantSelection() {
    let tenantArray: string[] = this.promocodeForm.get('tenants')?.value;
    const index = tenantArray.indexOf('select-all');
    if (index > -1) {
      tenantArray.splice(index, 1);
      this.allTenantSelected = !this.allTenantSelected;
    }
    this.sites = [];
    this.chargePoints = [];
    this.tenantList = tenantArray;
    this.promocodeForm.controls['tenants'].setValue(tenantArray);
    this.getSitesFromTenants(tenantArray);
  }

  getSitesFromTenants(tenantList: any) {
    this.sites = [];
    this.chargePoints = [];
    const index = tenantList.indexOf('select-all');
    if (index > -1) {
      tenantList.splice(index, 1);
    }
    this.httpDataService
      .get(AppConstants.APIUrlTenantToSiteList + String(tenantList))
      .subscribe((res) => {
        this.sites = res;
        this.promocodeForm.controls['sites'].reset();
        this.promocodeForm.controls['chargePoints'].reset();
      });
  }

  toggleAllSiteSelection() {
    this.allSiteSelected = !this.allSiteSelected;
    let siteArray: any[] = [];
    if (this.allSiteSelected) {
      siteArray.push('select-all');
      for (let index = 0; index < this.sites.length; index++) {
        siteArray.push(this.sites[index].siteId);
        if (this.sites.length - 1 === index) {
          this.promocodeForm.controls['sites'].setValue(siteArray);
          this.getChargePointsFromSite(siteArray);
        }
      }
    } else {
      this.chargePoints = [];
      this.promocodeForm.controls['sites'].setValue([]);
      this.promocodeForm.controls['chargePoints'].reset();
    }
  }

  siteSelection() {
    let siteArray: string[] = this.promocodeForm.get('sites')?.value;
    const index = siteArray.indexOf('select-all');
    if (index > -1) {
      siteArray.splice(index, 1);
      this.allSiteSelected = !this.allSiteSelected;
    }
    this.chargePoints = [];
    this.siteList = siteArray;
    this.promocodeForm.controls['sites'].setValue(siteArray);
    this.getChargePointsFromSite(siteArray);
  }

  getChargePointsFromSite(siteList: any) {
    this.chargePoints = [];
    const index = siteList.indexOf('select-all');
    if (index > -1) {
      siteList.splice(index, 1);
    }
    this.httpDataService
      .get(
        AppConstants.APIUrlSiteToChargePointList +
          String(siteList) +
          '/' +
          String(this.tenantList)
      )
      .subscribe((res) => {
        this.chargePoints = res;
        this.promocodeForm.controls['chargePoints'].reset();
      });
  }

  toggleAllChargePointSelection() {
    this.allChargePointSelected = !this.allChargePointSelected;
    let chargePointArray: any[] = [];
    if (this.allChargePointSelected) {
      chargePointArray.push('select-all');
      for (let index = 0; index < this.chargePoints.length; index++) {
        chargePointArray.push(this.chargePoints[index].chargePointId);
        if (this.chargePoints.length - 1 === index) {
          this.promocodeForm.controls['chargePoints'].setValue(
            chargePointArray
          );
        }
      }
    } else {
      this.promocodeForm.controls['chargePoints'].setValue([]);
    }
  }

  chargePointSelection() {
    let chargePointArray: string[] =
      this.promocodeForm.get('chargePoints')?.value;
    const index = chargePointArray.indexOf('select-all');
    if (index > -1) {
      chargePointArray.splice(index, 1);
      this.allChargePointSelected = !this.allChargePointSelected;
    }
    this.promocodeForm.controls['chargePoints'].setValue(chargePointArray);
  }

  getReport() {
    if (this.promocodeForm.valid) {
      this.process = true;
      this.dataSource.data = [];
      const tindex = this.promocodeForm.get('tenants')?.value.indexOf('select-all');
      if (tindex > -1) {
        this.promocodeForm.get('tenants')?.value.splice(tindex, 1);
      }
      const sindex = this.promocodeForm.get('sites')?.value.indexOf('select-all');
      if (sindex > -1) {
        this.promocodeForm.get('sites')?.value.splice(sindex, 1);
      }
      const cindex = this.promocodeForm.get('chargePoints')?.value.indexOf('select-all');
      if (cindex > -1) {
        this.promocodeForm.get('chargePoints')?.value.splice(cindex, 1);
      }
      this.httpDataService
      .post(AppConstants.APIUrlGetPromoCodeDetails, {
        tenants: "'" + this.promocodeForm.get('tenants')?.value.join("','") + "'",
        sites: "'" + this.promocodeForm.get('sites')?.value.join("','") + "'",
        // chargepoints: "'" + this.promocodeForm.get('chargePoints')?.value.join("','") + "'",
        chargepoints: this.promocodeForm.get('chargePoints')?.value.join(","),
        transactionStartDate: Helper.getFormattedDate(
          this.promocodeForm.get('startDate')?.value
        ),
        transactionEndDate: Helper.getFormattedDate(
          this.promocodeForm.get('endDate')?.value
        ),
      })
      .subscribe(
        (res) => {
          this.dataSource.data = res.data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.cdref.detectChanges();
          this.process = false;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  downloadReport() {
    let csvData = this.ConvertToCSV(this.dataSource.data, ['tenant',
    'site',
    'chargePoint',
    'customerId',
    'noofTimesUsed',
    'promocode']);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", "PromoCode-Details-Report.csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray: any, headerList: any) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'Sr. No.,';
    let newHeaders = ['Organization','Site', 'ChargePoint', 'Customer ID', 'No. of Times Used', 'Promocode'];
    for (let index in newHeaders) {
      row += newHeaders[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];
        line += ',' + this.strRep(array[i][head]);
      }
      str += line + '\r\n';
    }
    return str;
  }

  strRep(data: any) {
    console.log(typeof data);
    if(typeof data == 'string') {
      let newData = data.replace(/,/g, " ");
       return newData;
    }
    else if(typeof data == 'object') {
      return "-";
    }
    else if(typeof data == 'number') {
      return  data.toString();
    }
    else {
      return data;
    }
  }
}
