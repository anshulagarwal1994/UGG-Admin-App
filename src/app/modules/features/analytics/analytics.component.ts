import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Tenant } from '@app/models/tenant.model';
import { Site } from 'src/app/models/site.model';
import { AppConstants } from '@app/constants';
import { HttpDataService } from '@app/shared/services/http-data.service';
import Helper from '@app/shared/utility/Helper';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '@env';
import { Router } from '@angular/router';
import { RoleType } from '@app/shared/services/roles.enum';
import { RouterExtService } from '@app/shared/services/routerExt.service';



@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})

export class AnalyticsComponent implements OnInit {
  // dtOptions: DataTables.Settings = {};

  public isMasterAdmin = false;
  tenants: Tenant[];
  selectedTenant: any = '';
  sites: Site[] = [];
  selectedSite: any = '';
  chargePoints: any = [];
  selectedChargePoint: any = '';
  maxDate = new Date();
  startDate: any = '';
  endDate: any = '';
  tenantCount: number = 0;
  sitesCount: number = 0;
  chargePointsCount: number = 0;
  connectorsAvailableCount: number = 0;
  connectorsInUseCount: number = 0;
  displayStyle = "none";
  connectorsOfflineCount: number = 0;
  connectorsUnavailableCount: number = 0;
  failedTransactionCount: any = 0;
  successfulTransactionCount: any = 0;
  totalAmount: any = 0;
  totalUnitsConsumed: any = 0;
  registeredUser: any = 0;
  onlineChargers: any = [];
  onlineSiteChargers: any = [];
  offlineChargers: any = [];
  offlineSiteChargers: any = [];
  chartData: ChartDataSets[] = [];
  chartLabel: Label[] = [];
  chartLegend = false;
  chartOptions: ChartOptions = {
    responsive: true,
  };
  chartColors: Color[] = [
    {
      // Red
      backgroundColor: 'rgba(255, 99, 132, 0.4)',
      borderColor: 'rgba(255, 99, 132, 1)',
    },
    {
      // Orange
      backgroundColor: 'rgba(255, 159, 64, 0.4)',
      borderColor: 'rgba(255, 159, 64, 1)',
    },
    {
      // Blue
      backgroundColor: 'rgba(54, 162, 235, 0.4)',
      borderColor: 'rgba(54, 162, 235, 1)',
    },
    {
      // Purple
      backgroundColor: 'rgba(153, 102, 255, 0.4)',
      borderColor: 'rgba(153, 102, 255, 1)',
    },
    {
      // Green
      backgroundColor: 'rgba(75, 192, 192, 0.4)',
      borderColor: 'rgba(75, 192, 192, 1)',
    },
    {
      // Yellow
      backgroundColor: 'rgba(255, 206, 86, 0.4)',
      borderColor: 'rgba(255, 206, 86, 1)',
    },
  ];
  chartPlugins: any = [];
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    'siteName',
    'siteAddress',
    'chargers',
    'connectors',
    'energryUsed',
    'revenue',
  ];
  tableProcess = false;
  pageNumber: number = 0;
  pageSize: number = 5;
  totalCount: number = 0;
  @ViewChild(MatPaginator, { static: true })
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
  connection: any;
  public roleType = RoleType;
  public userRole = '';
  public countprocess = true;
  public greenprocess = false;

  // chartClicked(event: any) {
  //   console.log(event);
  // }

  // chartHovered(event: any) {
  //   console.log(event);
  // }

  constructor(
    private httpDataService: HttpDataService,
    private cdref: ChangeDetectorRef,
    private routerExtService: RouterExtService,
    public router: Router,
  ) { }

  ngOnInit(): void {

   
    // let table = new DataTable('#myTable');
    this.getTenantNames();
    const sessionRole = localStorage.getItem('role') || '';
    if (sessionRole) {
      this.userRole = Helper.decodeRole(sessionRole);
      if (this.userRole === this.roleType.MasterAdmin) {
        this.isMasterAdmin = true;
        this.connection = new HubConnectionBuilder()
          .withUrl(environment.signalRCountURL)
          .build();
        this.connection
          .start()
          .then(() => {
            console.log('connected to SignalR!');
            console.log('connectionId ', this.connection.connectionId);
            this.connection.on('targetupdate', (data: any) => {
              console.log(data);
              this.tenantCount = data.Tenants;
              console.log("tenantCount = ", this.tenantCount)
              // this.sitesCount = data.Sites;
              // this.chargePointsCount = data.ChargePoints;
              this.connectorsAvailableCount = data.Connectors_Available;
              this.connectorsInUseCount = data.Connectors_InUse;
              this.connectorsOfflineCount = data.Connectors_Offline;
            });
          })
          .catch((err: any) =>
            console.log('error while establishing signalr connection: ' + err)
          );
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  
  
  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }

  getCardCount(tenantId: any) {
    this.httpDataService
      .get(AppConstants.APIUrlDashboardCard + '?tenantId=' + tenantId)
      .subscribe((res) => {
        console.log("res",res);
        
        this.tenantCount = res.tenants;
        this.sitesCount = res.sites;
        this.chargePointsCount = res.chargePoints;
        this.connectorsAvailableCount = res.connectors_Available;
        this.connectorsInUseCount = res.connectors_InUse;
        this.connectorsOfflineCount = res.connectors_Offline;
        this.countprocess = false;
      });
    this.httpDataService
      .get(AppConstants.APIUrlGetUnavailableChargers)
      .subscribe((res) => {
        this.connectorsUnavailableCount = res.connectors;
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

  getTenantNames() {
    return this.httpDataService
      .get(AppConstants.APIUrlTenantNameListtUrl)
      .subscribe((res: Tenant[]) => {
        this.tenants = res.sort(this.SortArray);
        if (this.tenants.length) {
          localStorage.setItem('selectedTenantId', this.tenants[0].tenantId.toString());
          this.tenantSelection(this.tenants[0]);
          this.getCardCount(this.tenants[0].tenantId);
        }
      });
  }

  tenantSelection(tenant: any) {
    console.log("Here In this");
    
    this.greenprocess = true;
    this.countprocess = true;
    this.dataSource.data = [];
    this.sites = [];
    this.chargePoints = [];
    this.onlineChargers = [];
    this.offlineChargers = [];
    this.httpDataService
      .get(AppConstants.APIUrlGetSites + tenant.tenantId + '/' + false)
      .subscribe(
        (res) => {
          this.sites = res;
          this.selectedTenant = tenant;
          this.chargePoints = [];
          localStorage.setItem('selectedTenantId', JSON.stringify(tenant.tenantId));
          this.getCardCount(tenant.tenantId);
          this.getChargerData();
          this.getOnlineChargers();
          this.getOfflineChargers();
          this.endDate = new Date();
          this.startDate = new Date(
            this.endDate.getTime() - 90 * 24 * 60 * 60 * 1000
          );
          this.getStatistics();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  siteSelection(site: any) {
    this.httpDataService
      .get(
        AppConstants.APIUrlChargePointsById +
        this.selectedTenant.tenantId +
        '/' +
        site.siteId +
        '/' +
        false
      )
      .subscribe(
        (res) => {
          this.onlineSiteChargers = [];
          this.offlineSiteChargers = [];
          this.chargePoints = res;
          this.selectedSite = site;
          this.onlineChargers.forEach((element: any) => {
            if (element.siteId === this.selectedSite.siteId) {
              this.onlineSiteChargers.push(element);
            }
          });
          this.offlineChargers.forEach((element: any) => {
            if (element.siteId === this.selectedSite.siteId) {
              this.offlineSiteChargers.push(element);
            }
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  chargePointSelection(chargepoint: any) {
    this.selectedChargePoint = chargepoint;
  }

  getStatistics() {
    if (this.startDate && this.endDate) {
      this.chartData = [];
      this.chartLabel = [];
      this.httpDataService
        .get(
          AppConstants.APIUrlGetStatistics +
          this.selectedTenant.tenantId +
          '/' +
          Helper.getFormattedDate(this.startDate) +
          '/' +
          Helper.getFormattedDate(this.endDate)
        )
        .subscribe(
          (res) => {
            this.failedTransactionCount = res?.data?.failedTransactionCount ? res?.data?.failedTransactionCount : 0;
            this.successfulTransactionCount =
              res?.data?.successfulTransactionCount ? res?.data?.successfulTransactionCount : 0;
            this.totalAmount = res?.data?.totalAmount ? parseFloat(res?.data?.totalAmount).toFixed(2) : 0;
            this.totalUnitsConsumed = res?.data?.totalUnitsConsumed ? parseFloat(
              res?.data?.totalUnitsConsumed
            ).toFixed(2) : 0;
          },
          (error) => {
            console.log(error);
          }
        );
      this.httpDataService
        .post(AppConstants.APIUrlGetRegisteredUsers, {
          // tenantId: this.selectedTenant.tenantId,
          startDate: Helper.getFormattedDate(this.startDate),
          endDate: Helper.getFormattedDate(this.endDate),
        })
        .subscribe(
          (res) => {
            this.registeredUser = res;
          },
          (error) => {
            console.log(error);
          }
        );
      this.httpDataService
        .get(
          AppConstants.APIUrlGetGraphData +
          Helper.getFormattedDate(this.startDate) +
          '/' +
          Helper.getFormattedDate(this.endDate) +
          '/' +
          this.selectedTenant.tenantId
        )
        .subscribe(
          (res) => {
            let totalAmountData: any = [];
            let totalTransactionsData: any = [];
            let newUserData: any = [];
            let newGuestUserData: any = [];
            res?.data.forEach((element: any, index: number) => {
              this.chartLabel.push(element.transactionDate);
              totalAmountData.push(parseFloat(element.totalAmount).toFixed(2));
              totalTransactionsData.push(element.totalTransactions);
              newUserData.push(element.newUser);
              newGuestUserData.push(element.newGuestUser);
              if (res.data.length - 1 === index) {
                if (this.isMasterAdmin) {
                  this.chartData = [
                    {
                      label: 'Total Revenue',
                      data: totalAmountData,
                      borderWidth: 1,
                    },
                    {
                      label: 'Transactions',
                      data: totalTransactionsData,
                      borderWidth: 1,
                    },
                    {
                      label: 'Registered User',
                      data: newUserData,
                      borderWidth: 1,
                    },
                    {
                      label: 'Guest User',
                      data: newGuestUserData,
                      borderWidth: 1,
                    },
                  ];
                } else {
                  this.chartData = [
                    {
                      label: 'Total Revenue',
                      data: totalAmountData,
                      borderWidth: 1,
                    },
                    {
                      label: 'Transactions',
                      data: totalTransactionsData,
                      borderWidth: 1,
                    },
                  ];
                }
              }
            });
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  pageChanged(event: PageEvent) {
    this.tableProcess = true;
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.getChargerData();
  }

  getChargerData() {
    this.dataSource.data = [];
    this.httpDataService
      .get(AppConstants.APIUrlGetChargerData + this.selectedTenant.tenantId + '/' + Number(this.pageNumber + 1) + '/' + this.pageSize)
      .subscribe(
        (res) => {
          this.dataSource.data = res.list;
          this.totalCount = res.totalCount;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.cdref.detectChanges();
          this.greenprocess = false;
          this.tableProcess = false;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getOnlineChargers() {
    this.httpDataService
      .get(AppConstants.APIUrlGetOnlineChargers + this.selectedTenant.tenantId)
      .subscribe(
        (res) => {
          this.onlineChargers = res;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getOfflineChargers() {
    this.httpDataService
      .get(AppConstants.APIUrlGetOfflineChargers + this.selectedTenant.tenantId)
      .subscribe(
        (res) => {
          this.offlineChargers = res;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  goToSite() {
    localStorage.setItem('parentTenantRequest', this.selectedTenant.isRequestRaised);
    localStorage.setItem('tenantName', this.selectedTenant.name);
    localStorage.setItem('tenantId', this.selectedTenant.tenantId);
    this.routerExtService.clearRouteValue();
    this.routerExtService.setRouteValue(AppConstants.TenantID, this.selectedTenant.tenantId.toString());
    this.router.navigate([AppConstants.TenantDetailPage]);
  }

}
