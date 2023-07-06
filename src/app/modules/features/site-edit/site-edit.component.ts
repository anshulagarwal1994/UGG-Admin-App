import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Site } from 'src/app/models/site.model';
import { HttpDataService } from 'src/app/shared/services/http-data.service';
import Helper from 'src/app/shared/utility/Helper';
import { RoleType } from '@app/shared/services/roles.enum';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from '@app/shared/services/translate-config.service';
import { map, startWith } from 'rxjs/operators';
import { GridFilterService } from '@app/shared/utility/grid-filter.service';
import { AppConstants } from '@app/constants';
import { PopUpService } from '@app/shared/utility/popup.service';
import { RouterExtService } from '@app/shared/services/routerExt.service';
import { IndexedDBService } from '@app/shared/utility/indexed-db.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDeleteDialogComponent } from '@app/mat-delete-dialog/mat-delete-dialog.component';

@Component({
  selector: 'app-site-edit',
  templateUrl: './site-edit.component.html',
  styleUrls: ['./site-edit.component.css'],
})
export class SiteEditComponent implements OnInit {
  siteForm: FormGroup;
  tenantId: Guid;
  siteId: Guid;
  site: Site;
  data = {};
  stringJson: any;
  errors: string[];
  tenantName: any = '';
  siteName: any = '';
  canUpdateSite = false;
  canCreateChargepoint = false;
  canDeleteChargepoint = false;
  canModifyPreAuth = false;
  canModifyMarkupCharge = false;
  deletedRecords = false;
  process = true;
  Presname: any;
  Presstreet: any;
  Presstate: any;
  Prescity: any;
  Prescountry: any;
  PreszipCode: any;
  Presphone: any;
  PresutilityProvider: any;
  Presutilitytdu: any;
  Presstatus: any;

  // countryList : any  = (Country  as  any).default;
  dialogRef: MatDialogRef<any>;
  invalidFileSize: boolean = false;
  invalidFileType: boolean = false;
  roleType = RoleType;
  userRole = '';
  selectedFileSizeInBytes: number = 0;
  selectedFileSizeInMiB: number = 0;
  parentSiteRequest = false;
  maxFileSizeInBytes: number = 10 * 1024 * 1024;
  maxFileSizeInMiB: number = 0;
  fileContent: File;
  originalFileName: string;
  showUploadContent = false;
  imageSource: string;
  fileName: string;
  popUpData: string;
  siteById: string;
  markupThreshold: number = 0;
  markupError = false;
  markupDCError = false;
  supportedFileTypes: string = `.pdf,.doc,.docx,.ppt,.pptx,.txt,.rtf,.csv,.eps,.bmp,.svg,.png,.jpg,.jpeg,.gif,.tiff,.tif,.mp3,.mp4,.wmv`;
  pageNumber: number = 0;
  pageSize: number = 5;
  totalCount: number = 0;
  countryList = [
    {
      country: 'Canada',
    },
    {
      country: 'Mexico',
    },
    {
      country: 'United States',
    },
  ];
  @ViewChild('myUpload') myUploadVariable: ElementRef;
  // dataSource = new MatTableDataSource();
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    'chargePointId',
    'chargerType',
    'availabilityStatus',
    'numberOfConnectors',
    'connectortype1',
    'connectortype2',
    'action',
  ];
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

  get name(): boolean {
    return (
      !Helper.isNullOrEmpty(this.siteForm.get('name')?.value) &&
      (this.siteForm.get('name')?.value.length <= 3 ||
        this.siteForm.get('name')?.value.length > 150)
    );
  }

  get phone(): boolean {
    return (
      !Helper.isNullOrEmpty(this.siteForm.get('phone')?.value) &&
      (this.siteForm.get('phone')?.value.length <= 10 ||
        this.siteForm.get('phone')?.value.length > 250)
    );
  }

  get country(): boolean {
    return (
      !Helper.isNullOrWhitespace(this.siteForm.get('country')?.value) &&
      (this.siteForm.get('country')?.value.length <= 3 ||
        this.siteForm.get('country')?.value.length > 100)
    );
  }

  get city(): boolean {
    return (
      !Helper.isNullOrWhitespace(this.siteForm.get('city')?.value) &&
      (this.siteForm.get('city')?.value.length <= 3 ||
        this.siteForm.get('city')?.value.length > 100)
    );
  }

  get state(): boolean {
    return (
      !Helper.isNullOrEmpty(this.siteForm.get('state')?.value) &&
      (this.siteForm.get('state')?.value.length <= 3 ||
        this.siteForm.get('state')?.value.length > 100)
    );
  }

  get provider(): boolean {
    return (
      !Helper.isNullOrWhitespace(this.siteForm.get('utilityProvider')?.value) &&
      this.siteForm.get('utilityProvider')?.value.length <= 3
    );
  }

  get utilitytdu(): boolean {
    return !Helper.isNullOrWhitespace(this.siteForm.get('utilitytdu')?.value);
  }

  get street(): boolean {
    return (
      !Helper.isNullOrEmpty(this.siteForm.get('street')?.value) &&
      (this.siteForm.get('street')?.value.length <= 15 ||
        this.siteForm.get('street')?.value.length > 250)
    );
  }

  get zip(): boolean {
    return (
      !Helper.isNullOrEmpty(this.siteForm.get('zipCode')?.value) &&
      (this.siteForm.get('zipCode')?.value.length <= 5 ||
        this.siteForm.get('zipCode')?.value.length > 11)
    );
  }

  get address(): boolean {
    return (
      !Helper.isNullOrEmpty(this.siteForm.get('street')?.value) &&
      (this.siteForm.get('street')?.value.length <= 3 ||
        this.siteForm.get('street')?.value.length > 250)
    );
  }

  get hasBillUrl(): boolean {
    return !Helper.isNullOrEmpty(this.imageSource);
  }

  //Grid columns
  filterSelectObj = [
    {
      name: 'chargePointId',
      columnProp: 'chargePointId',
      type: 'text',
      options: [] as string[],
      modelValue: '',
    },
    {
      name: 'chargerType',
      columnProp: 'chargerType',
      type: 'text',
      options: [] as string[],
      modelValue: '',
    },
    {
      name: 'availabilityStatus',
      columnProp: 'availabilityStatus',
      type: 'text',
      options: [] as string[],
      modelValue: '',
    },
  ];

  filterValues: any = {};

  chargePointIdControl = new FormControl();
  filteredByChargePointId: Observable<string[]>;
  chargePointId: any[];
  chargePointIdValues: any[];

  chargeTypeControl = new FormControl();
  filteredByChargeType: Observable<string[]>;
  chargeTypeValues: any[];
  chargeType: any[];

  statusControl = new FormControl();
  filteredByStatus: Observable<string[]>;
  statusValues: any[];
  status: any[];

  isTransferred = false;

  private _filter(value: string, input: string[]): string[] {
    const filterValue = value.toString().toLowerCase();

    return input?.filter(
      (v) => v?.toString().toLowerCase().indexOf(filterValue) === 0
    );
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly httpDataService: HttpDataService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public translateConfigService: TranslateConfigService,
    public filterService: GridFilterService,
    private router: Router,
    private popUpService: PopUpService,
    public dialog: MatDialog,
    private cdref: ChangeDetectorRef,
    private routerExtService: RouterExtService,
    private indexedDBService: IndexedDBService
  ) {
    const sessionRole = localStorage.getItem('role') || '';
    if (sessionRole) {
      this.userRole = Helper.decodeRole(sessionRole);
    }
    this.site = new Site();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  buildSiteForm() {
    this.siteForm = this.formBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150),
          Validators.pattern(AppConstants.addressPattern),
        ],
      ],
      street: [
        null,
        [Validators.required, Validators.pattern(AppConstants.addressPattern)],
      ],
      phone: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(15),
        ],
      ],
      state: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern(AppConstants.addressPattern),
        ],
      ],
      city: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern(AppConstants.addressPattern),
        ],
      ],
      country: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      zipCode: [
        null,
        [
          Validators.required,
          Validators.pattern(AppConstants.numberPattern),
          Validators.minLength(5),
          Validators.maxLength(6),
        ],
      ],
      utilityProvider: [null, []],
      utilityBill: [null, []],
      utilitytdu: [null, []],
      level2Rate: [null, [Validators.required]],
      level2RateUnit: [null, [Validators.required]],
      dcFastRate: [null, [Validators.required]],
      dcFastRateUnit: [null, [Validators.required]],
      preAuthAmount: [0, []],
      markupCharge: [0, []],
      markupPercentForDC: [0, []],
      status: [null],
    });
  }

  onKeyPress(event: any) {
    const regexpNumber = /[0-9\+\-\ ]/;
    let inputCharacter = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !regexpNumber.test(inputCharacter)) {
      event.preventDefault();
    }
  }
  back() {
    this.router.navigate(['/tenant-edit']);
  }
  ngOnInit(): void {
    this.indexedDBService
      .getRecordData('PermissionDB', 'permission', 'Site Management')
      .then((data: any) => {
        data.previlleges.forEach((pp: any) => {
          if (pp.key === 'Update Site Details') {
            this.canUpdateSite = pp.value;
          }
          if (pp.key === 'Update Site PreAuth') {
            this.canModifyPreAuth = pp.value;
          }
          if (pp.key === 'Update Site Markup') {
            this.canModifyMarkupCharge = pp.value;
          }
          if (pp.key === 'Markup Threshold') {
            this.markupThreshold = parseFloat(pp.markupThreshold);
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
    this.indexedDBService
      .getRecordData('PermissionDB', 'permission', 'Charger Management')
      .then((data: any) => {
        data.previlleges.forEach((pp: any) => {
          if (pp.key === 'Create Chargepoint') {
            this.canCreateChargepoint = pp.value;
          }
          if (pp.key === 'Delete Chargepoint') {
            this.canDeleteChargepoint = pp.value;
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
    this.dataSource.data = [];
    this.translateConfigService.localEvent.subscribe((data) => {
      this.translator();
    });
    this.buildSiteForm();
    setTimeout(() => {
      this.tenantName = localStorage.getItem('tenantName');
      this.siteName = this.routerExtService.getRouteValue(
        AppConstants.siteName
      );
    }, 1000);
    if (localStorage.getItem('parentSiteRequest')) {
      this.parentSiteRequest =
        localStorage.getItem('parentSiteRequest') === 'true' ? true : false;
    } else if (localStorage.getItem('parentTenantRequest')) {
      this.parentSiteRequest =
        localStorage.getItem('parentTenantRequest') === 'true' ? true : false;
    }
    this.tenantId = this.routerExtService.getRouteValue(AppConstants.TenantID);
    this.siteId = this.routerExtService.getRouteValue(AppConstants.SiteID);

    // this.activatedRoute.params.subscribe(params => {
    //   this.tenantId = params['tenantId'];
    //   this.siteId = params['siteId'];
    // });
    this.siteById = `${this.tenantId}/${this.siteId}`;
    this.getSiteById();
    this.onChanges();
    // this.getChargePoints(this.siteById);
  }

  getSiteById() {
    this.httpDataService
      .getById(AppConstants.APIUrlGetSiteById, this.siteById)
      .subscribe(
        (result: Site) => {
          if (result.isTransferred) {
            if (this.roleType.Distributor === this.userRole) {
              this.canCreateChargepoint = false;
              this.isTransferred = true;
              localStorage.setItem('sitetransferred', 'true');
            } else {
              this.isTransferred = false;
              localStorage.setItem('sitetransferred', 'false');
            }
          } else {
            this.isTransferred = false;
            localStorage.setItem('sitetransferred', 'false');
          }
          this.setSite(result);
          this.routerExtService.setRouteValue(
            AppConstants.siteName,
            result.name.toString()
          );
          this.getChargePoints(this.siteById);
          this.imageSource = result.utilityBillUrl;
          // console.table(result);
          // Overrride default filter behaviour of Material Datatable
          this.dataSource.filterPredicate = this.filterService.createFilter();
        },
        (error) => {
          if (!Helper.isNullOrWhitespace(error)) {
            if (!Helper.isNullOrWhitespace(error.error.errors)) {
              const validationErrors = error.error.errors;
              this.serverError(validationErrors);
            } else {
              this.popUpData = this.serverErrorMsgResponse(error.error);
              this.popUpService.showMsg(
                this.popUpData,
                AppConstants.EmptyUrl,
                AppConstants.Error,
                AppConstants.Error
              );
            }
          }
        }
      );
  }

  onChanges(): void {
    this.siteForm.get('level2RateUnit')?.valueChanges.subscribe((val) => {
      if (Helper.hasAny(val) && val == 'Min') {
        this.siteForm
          .get('level2Rate')
          ?.setValue(AppConstants.DefaultLevel2Rate);
      } else if (Helper.hasAny(val) && val == 'KWH') {
        this.siteForm.get('level2Rate')?.setValue(0);
      }
    });

    this.siteForm.get('dcFastRateUnit')?.valueChanges.subscribe((val) => {
      if (Helper.hasAny(val) && val == 'Min') {
        this.siteForm
          .get('dcFastRate')
          ?.setValue(AppConstants.DefaultDcFastRate);
      } else {
        this.siteForm.get('dcFastRate')?.setValue(0);
      }
    });
  }

  getChargePointIdAutoComplete() {
    this.chargePointIdValues = this.filterService.getFilterObject(
      this.dataSource.data,
      'chargePointId'
    );
    this.filteredByChargePointId = this.chargePointIdControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.chargePointIdValues))
    );
  }

  getChargeTypeAutoComplete() {
    this.chargeTypeValues = this.filterService.getFilterObject(
      this.dataSource.data,
      'chargerType'
    );
    this.filteredByChargeType = this.chargeTypeControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.chargeTypeValues))
    );
  }

  getStatusAutoComplete() {
    this.statusValues = this.filterService.getFilterObject(
      this.dataSource.data,
      'availabilityStatus'
    );
    this.filteredByStatus = this.statusControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.statusValues))
    );
  }

  // Called on Filter change
  filterChange(filter: any, event: any) {
    if (event.option != undefined) {
      this.filterValues[filter?.columnProp] = event.option.value
        .toString()
        .trim()
        .toLowerCase();
    } else {
      if (!Helper.isNullOrEmpty(this.chargePointIdControl.value))
        this.filterValues[filter?.columnProp] = this.chargePointIdControl.value
          .toString()
          .trim()
          .toLowerCase();
      else if (!Helper.isNullOrEmpty(this.chargeTypeControl.value))
        this.filterValues[filter?.columnProp] = this.chargeTypeControl.value
          .toString()
          .trim()
          .toLowerCase();
      else if (!Helper.isNullOrEmpty(this.statusControl.value))
        this.filterValues[filter?.columnProp] = this.statusControl.value
          .toString()
          .trim()
          .toLowerCase();
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Reset table filters
  resetFilters() {
    this.chargePointIdControl.setValue('');
    this.chargeTypeControl.setValue('');
    this.statusControl.setValue('');
    this.filterValues = {};
    this.filterSelectObj.forEach((value: any, key: any) => {
      value.modelValue = undefined;
    });
    this.dataSource.filter = '';
  }

  translator() {
    this.translate.get('singleBinding.itemPage').subscribe((data) => {
      this.paginator._intl.itemsPerPageLabel = data;
      this.paginator.ngOnInit();
    });
  }

  setSite(site: Site) {
    this.Presname = site.name;
    this.Presstreet = site.address.street;
    this.Presstate = site.address.state;
    this.Prescity = site.address.city;
    this.Prescountry = site.address.country;
    this.PreszipCode = site.address.zipcode;
    this.Presphone = site.phone;
    this.PresutilityProvider = site.utilityProvider;
    this.Presutilitytdu = site.utilitytdu;
    this.Presstatus = site.status;

    this.siteForm.patchValue({
      name: site.name,
      street: site.address.street,
      state: site.address.state,
      city: site.address.city,
      country: site.address.country,
      zipCode: site.address.zipcode,
      phone: site.phone,
      utilityProvider: site.utilityProvider,
      utilityBill: site.utilityBillUrl,
      utilitytdu: site.utilitytdu,
      level2RateUnit: site.level2RateUnit,
      dcFastRateUnit: site.dcFastRateUnit,
      status: site.status,
      preAuthAmount: site.preAuthAmount ? site.preAuthAmount : 0,
      markupCharge: site.markupCharge ? site.markupCharge : 0,
      markupPercentForDC: site.markupPercentForDC ? site.markupPercentForDC : 0,
    });

    this.siteForm.patchValue({
      level2Rate: site.level2Rate,
      dcFastRate: site.dcFastRate,
    });

    this.fileName = site.utilityBillUrl
      ? site.utilityBillUrl
          .split('?')[0]
          .substr(site.utilityBillUrl.split('?')[0].lastIndexOf('/') + 1)
      : '';
  }

  validateMarkupThreshold(event: any) {
    let value = parseFloat(event.target.value);
    if (value > this.markupThreshold) {
      this.markupError = true;
      this.siteForm.controls['markupCharge'].setErrors({ error: true });
    } else {
      this.markupError = false;
      this.siteForm.controls['markupCharge'].updateValueAndValidity();
    }
  }

  validateDCMarkupThreshold(event: any) {
    let value = parseFloat(event.target.value);
    if (value > this.markupThreshold) {
      this.markupDCError = true;
      this.siteForm.controls['markupPercentForDC'].setErrors({ error: true });
    } else {
      this.markupDCError = false;
      this.siteForm.controls['markupPercentForDC'].updateValueAndValidity();
    }
  }

  updateSite() {
    this.mapSite();
    if (this.siteForm.dirty && this.siteForm.valid && this.siteForm.touched) {
      this.modifySite(this.site, this.tenantId, this.siteId).subscribe(
        (result: any) => {
          this.siteForm.markAsUntouched();
          this.popUpService.showMsg(
            AppConstants.SiteUpdated,
            AppConstants.TenantDetailPage + this.tenantId,
            AppConstants.Success,
            AppConstants.Success
          );
          document.getElementById('Description').style.display = 'block';
          document.getElementById('EditForm').style.display = 'none';
        },
        (error) => {
          if (!Helper.isNullOrWhitespace(error)) {
            if (!Helper.isNullOrWhitespace(error.error.errors)) {
              const validationErrors = error.error.errors;
              this.serverError(validationErrors);
            } else {
              this.popUpData = this.serverErrorMsgResponse(error.error);
              this.popUpService.showMsg(
                this.popUpData,
                AppConstants.EmptyUrl,
                AppConstants.Error,
                AppConstants.Error
              );
            }
          } else {
            this.popUpData = this.serverErrorMsgResponse(error.error);
            this.popUpService.showMsg(
              this.popUpData,
              AppConstants.EmptyUrl,
              AppConstants.Error,
              AppConstants.Error
            );
          }
        }
      );
    } else {
      if (this.siteForm.valid)
        this.popUpService.showMsg(
          AppConstants.NoSiteChanges,
          AppConstants.EmptyUrl,
          AppConstants.Warning,
          AppConstants.Warning
        );
    }
  }

  serverErrorMsgResponse(error: any): string {
    if (!Helper.isNullOrEmpty(error.Message))
      return (this.popUpData = error.Message);
    else if (!Helper.isNullOrEmpty(error.message))
      return (this.popUpData = error.message);
    else if (!Helper.isNullOrEmpty(error.title))
      return (this.popUpData = error.title);
    else return (this.popUpData = error);
  }

  serverError(validationErrors: any) {
    Object.keys(validationErrors).forEach((prop) => {
      const formControl = this.siteForm.get(prop);
      if (formControl) {
        // this.errors.push(validationErrors[prop].join(','));
        formControl.setErrors({
          serverError: validationErrors[prop].join(','),
        });
      }
    });
  }

  modifySite(site: Site, tenantId: any, siteId: any): Observable<Site> {
    const ids: any = `${tenantId}/${siteId}`;
    let stringJson = JSON.stringify(site);
    let jsonObject: any = JSON.parse(stringJson);
    let formData = new FormData();
    Object.keys(jsonObject).forEach((key) => {
      if (key != 'utilityBill') {
        formData.append(key, jsonObject[key]);
      }
    });
    formData.append('siteId', siteId);
    formData.append('utilityBill', this.fileContent);
    formData.append('utilityBillUrl', this.imageSource);

    return this.httpDataService.siteUpdate(
      AppConstants.APIUrlSiteUpdateUrl + ids,
      formData
    );
  }

  clearUpload() {
    this.myUploadVariable.nativeElement.value = '';
    this.imageSource = '';
    this.fileName = '';
  }

  mapSite(): boolean {
    if (this.siteForm.valid) {
      this.site.siteId = this.siteId;
      this.site.name = this.siteForm.get('name')?.value;
      this.site.status = this.siteForm.get('status')?.value;
      this.site.street = this.siteForm.get('street')?.value;
      this.site.utilityProvider = this.siteForm.get('utilityProvider')?.value;
      this.site.utilitytdu = this.siteForm.get('utilitytdu')?.value;
      if (this.fileContent != undefined)
        this.site.utilityBill = this.fileContent;
      else this.site.utilityBillUrl = this.fileName;
      this.site.level2Rate = this.siteForm.get('level2Rate')?.value;
      this.site.level2RateUnit = this.siteForm.get('level2RateUnit')?.value;
      this.site.dcFastRate = this.siteForm.get('dcFastRate')?.value;
      this.site.dcFastRateUnit = this.siteForm.get('dcFastRateUnit')?.value;
      this.site.phone = this.siteForm.get('phone')?.value;
      this.site.state = this.siteForm.get('state')?.value;
      this.site.city = this.siteForm.get('city')?.value;
      this.site.country = this.siteForm.get('country')?.value;
      this.site.zipCode = this.siteForm.get('zipCode')?.value;
      this.site.preAuthAmount = this.siteForm.get('preAuthAmount')?.value
        ? this.siteForm.get('preAuthAmount')?.value
        : 0;
      this.site.markupCharge = this.siteForm.get('markupCharge')?.value
        ? this.siteForm.get('markupCharge')?.value
        : 0;
      this.site.markupPercentForDC = this.siteForm.get('markupPercentForDC')
        ?.value
        ? this.siteForm.get('markupPercentForDC')?.value
        : 0;

      return true;
    } else {
      return false;
    }
  }
  onFileChange(event: Event) {
    this.invalidFileSize = false;
    this.invalidFileType = false;
    this.selectedFileSizeInMiB = 0;
    this.selectedFileSizeInBytes = 0;

    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length) {
      // check fileSize
      this.selectedFileSizeInBytes = element.files[0].size;
      this.selectedFileSizeInMiB = this.selectedFileSizeInBytes / (1024 * 1024);
      this.invalidFileSize =
        this.selectedFileSizeInBytes > this.maxFileSizeInBytes;
      this.invalidFileType = Helper.isFileTypeNotSuported(
        element.files[0].name,
        this.supportedFileTypes.toLowerCase().split(',')
      );
      // get content
      if (!this.invalidFileSize && !this.invalidFileType) {
        this.fileContent = element.files[0];
        this.siteForm.get('utilityBill')?.markAsDirty();
        this.siteForm.get('utilityBill')?.markAsTouched();
        this.siteForm.get('utilityBill')?.setValue(this.fileContent);
        this.originalFileName = element.files[0].name;
        this.imageSource = '';
      } else {
        const errorMsg =
          'Invalid File' +
          (this.invalidFileSize
            ? ' Size '
            : this.invalidFileType
            ? ' Type '
            : '') +
          'Selected';
        this.toastr.warning(errorMsg);
      }
    }
  }

  navigateCharger() {
    const ids: any = `${this.tenantId}/${this.siteId}`;
    this.router.navigate([AppConstants.ChargerCreationUrl]);
  }
  chargeEdit(charge: any) {
    const chargePointById: any = `${this.tenantId}/${this.siteId}/${charge.chargePointId}`;
    this.routerExtService.setRouteValue(
      AppConstants.ChargePointID,
      charge.chargePointId.toString()
    );
    localStorage.setItem('chargePointId', charge.chargePointId);
    this.router.navigate([AppConstants.ChargerEditUrl]);
  }

  toggleDeletedRecords() {
    this.deletedRecords = !this.deletedRecords;
    this.getChargePoints(this.siteById);
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.getChargePoints(this.siteById);
  }

  getChargePoints(ids: any) {
    this.process = true;
    this.dataSource.data = [];
    this.httpDataService
      .get(
        AppConstants.APIUrlChargePointsById +
          ids +
          '/' +
          this.deletedRecords +
          '/' +
          Number(this.pageNumber + 1) +
          '/' +
          this.pageSize
      )
      .subscribe(
        (res) => {
          let data: any = [];
          if (res && res.list && res.list.length + 1) {
            data = res.list;
          } else {
            data = res;
          }
          this.dataSource.data = data;
          this.totalCount =
            res && res.list && res.list.length ? res.totalCount : res.length;
          if (this.totalCount) {
            this.getChargePointIdAutoComplete();
            this.getChargeTypeAutoComplete();
            this.getStatusAutoComplete();
          }
          this.cdref.detectChanges();
          this.process = false;
        },
        (error) => {
          this.popUpData = this.serverErrorMsgResponse(error.error);
          this.popUpService.showMsg(
            this.popUpData,
            AppConstants.EmptyUrl,
            AppConstants.Error,
            AppConstants.Error
          );
        }
      );
  }

  cancel() {
    // this.routerExtService.clearRouteValue();
    // this.routerExtService.setRouteValue(
    //   AppConstants.TenantID,
    //   this.tenantId.toString()
    // );
    // this.router.navigate([AppConstants.TenantDetailPage]);
    document.getElementById('Description').style.display = 'block';
    document.getElementById('EditForm').style.display = 'none';
  }

  deleteChargePoint(chargePoint: any) {
    this.dialogRef = this.dialog.open(MatDeleteDialogComponent, {
      width: '450px',
      panelClass: 'confirm-dialog-container',
      data: {
        title:
          'Are you sure, you want to request for deleting the chargepoint ?',
      },
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.httpDataService
          .post(AppConstants.APIUrlCreateDeleteRequest, {
            tenantId: this.tenantId,
            tenantName: this.tenantName,
            siteId: this.siteId,
            siteName: this.siteName,
            chargePointId: chargePoint.chargePointId,
            chargePointName: chargePoint.name,
          })
          .subscribe((res) => {
            this.getSiteById();
            this.onChanges();
          });
      }
    });
  }

  showEditForm() {
    document.getElementById('Description').style.display = 'none';
    document.getElementById('EditForm').style.display = 'block';
  }

  unDeleteChargePoint(chargePoint: any) {
    this.dialogRef = this.dialog.open(MatDeleteDialogComponent, {
      width: '600px',
      panelClass: 'confirm-dialog-container',
      data: {
        title:
          'Are you sure, you want to cancel the request for deleting the chargepoint ?',
      },
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.httpDataService
          .put(AppConstants.APIUrlUpdateDeleteRequest, {
            id: chargePoint.deleterequestid,
            status: 'Cancel',
          })
          .subscribe((res) => {
            this.getSiteById();
            this.onChanges();
          });
      }
    });
  }
}
