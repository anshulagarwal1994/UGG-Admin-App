import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import Helper from '@app/shared/utility/Helper';
import { AppConstants } from 'src/app/constants';
import { HttpDataService } from '@app/shared/services/http-data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Tenant } from '@app/models/tenant.model';

@Component({
  selector: 'app-financial-revenue-report',
  templateUrl: './financial-revenue-report.component.html',
  styleUrls: ['./financial-revenue-report.component.css'],
})
export class FinancialRevenueReportComponent {
  process = false;
  tenants: Tenant[];
  selectedTenant: any = '';
  maxDate = new Date();
  startDate: any = '';
  endDate: any = '';
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    'tenant',
    'site',
    'chargePoint',
    'transactionDate',
    'kwh',
    'amount',
    'transactionfees',
    'utilityFees',
    'netRevenue',
    'revenueShare',
    'cloudServiceFees',
    'amountOwed',
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
    private httpDataService: HttpDataService,
    private cdref: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    // let table = new DataTable('#myTable');
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
        if (this.tenants.length) {
          localStorage.setItem(
            'selectedTenantId',
            this.tenants[0].tenantId.toString()
          );
          this.tenantSelection(this.tenants[0]);
        }
      });
  }

  tenantSelection(tenant: any) {
    console.log('Here In this');
    this.selectedTenant = tenant;
  }
  getReport() {
    if (this.startDate && this.endDate) {
      this.process = true;
      this.dataSource.data = [];
      this.httpDataService
        .get(
          AppConstants.APIUrlGetFinancialRevenue +
            this.selectedTenant +
            Helper.getFormattedDate(this.startDate) +
            '/' +
            Helper.getFormattedDate(this.endDate)
        )
        .subscribe(
          (res) => {
            res.data.forEach((d: any) => {
              let transactionDate = new Date(d.transactionDate);
              d.transactionDate = transactionDate.toLocaleString('en-US', {
                timeZone: 'CST',
              });
            });
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
    if (this.dataSource.data.length > 0) {
      let csvData = this.ConvertToCSV(this.dataSource.data, [
        'tenant',
        'site',
        'chargePoint',
        'transactionDate',
        'kwh',
        'amount',
        'transactionfees',
        'utilityFees',
        'netRevenue',
        'revenueShare',
        'cloudServiceFees',
        'amountOwed',
      ]);
      let blob = new Blob(['\ufeff' + csvData], {
        type: 'text/csv;charset=utf-8;',
      });
      let dwldLink = document.createElement('a');
      let url = URL.createObjectURL(blob);
      let isSafariBrowser =
        navigator.userAgent.indexOf('Safari') != -1 &&
        navigator.userAgent.indexOf('Chrome') == -1;
      if (isSafariBrowser) {
        dwldLink.setAttribute('target', '_blank');
      }
      dwldLink.setAttribute('href', url);
      dwldLink.setAttribute('download', 'Financial-Revenue-Report.csv');
      dwldLink.style.visibility = 'hidden';
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
    }
  }

  ConvertToCSV(objArray: any, headerList: any) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'Sr. No.,';
    let newHeaders = [
      'Organization',
      'Site',
      'ChargePoint',
      'Date',
      'Consumed',
      'Amount',
      'Transaction Fees',
      'Utility Fees',
      'Revenue',
      'Revenue Share',
      'Cloud Service Fees',
      'Amount Owed',
    ];
    for (let index in newHeaders) {
      row += newHeaders[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + '';
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
    if (typeof data == 'string') {
      let newData = data.replace(/,/g, ' ');
      return newData;
    } else if (typeof data == 'object') {
      return '-';
    } else if (typeof data == 'number') {
      return data.toString();
    } else {
      return data;
    }
  }
}
