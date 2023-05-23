import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  Optional,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpDataService } from '@app/shared/services/http-data.service';
import { AppConstants } from '@app/constants';
import { Site } from 'src/app/models/site.model';
import { ChargePoint } from 'src/app/models/chargepoint.model';
import { PopUpService } from '@app/shared/utility/popup.service';

@Component({
  selector: 'app-mat-transfer-dialog',
  templateUrl: './mat-transfer-dialog.component.html',
  styleUrls: ['./mat-transfer-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatTransferDialogComponent implements OnInit {
  chargerType = '';
  revenueSharePercentage = '';
  vendorId = '';
  customerId = '';
  cloudServicesFees = '';
  utilityFees = '';
  transactionFees = '';
  sites: Site[];
  selectedSite: any = '';
  chargepoints: ChargePoint[];
  selectedChargepoint: any = '';

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private httpDataService: HttpDataService,
    public dialogRef: MatDialogRef<MatTransferDialogComponent>,
    private popUpService: PopUpService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    setTimeout(() => {
      this.getAllSites();
      this.getAllInactiveChargepoints();
    }, 1000);
  }

  radioChange(event: any) {}

  getAllSites() {
    this.httpDataService.get(AppConstants.APIUrlGetAllSites).subscribe(
      (res) => {
        this.sites = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllInactiveChargepoints() {
    this.httpDataService
      .get(AppConstants.APIUrlGetAllInactiveChargePoints)
      .subscribe(
        (res) => {
          this.chargepoints = res;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  transfer() {
    if (this.chargerType === '1') {
      this.httpDataService
      .post(AppConstants.APIUrlCreateTransferRequest, {
        tenantId: this.selectedSite.tenantId,
        siteId: this.selectedSite.siteId,
        chargePointId: this.data.chargePointId,
        transactionfees: this.transactionFees,
        utilityFees: this.utilityFees,
        cloudServiceFees: this.cloudServicesFees,
        revenueShare: this.revenueSharePercentage,
        customerId: this.customerId,
        vendorId: this.vendorId,
        chargerTypeDetails: 'New',
      })
      .subscribe(
        (res) => {
          this.dialogRef.close(true);
          this.popUpService.showMsg(
            'ChargePoint Transfer Request Created.',
            AppConstants.EmptyUrl,
            AppConstants.Success,
            AppConstants.Success
          );
        },
        (error) => {
          console.log(error);
          this.popUpService.showMsg(
            'ChargePoint Transfer Request Error.',
            AppConstants.EmptyUrl,
            AppConstants.Error,
            AppConstants.Error
          );
        }
      );
    } else {
      this.httpDataService
      .post(AppConstants.APIUrlCreateTransferRequest, {
        tenantId: this.selectedChargepoint.oldtenantid,
        siteId: this.selectedChargepoint.oldsiteid,
        chargePointId: this.data.chargePointId,
        transactionfees: this.transactionFees,
        utilityFees: this.utilityFees,
        cloudServiceFees: this.cloudServicesFees,
        revenueShare: this.revenueSharePercentage,
        customerId: this.customerId,
        vendorId: this.vendorId,
        chargerTypeDetails: 'Replacement',
        replacementChargePointId: this.selectedChargepoint.chargePointId
      })
      .subscribe(
        (res) => {
          this.dialogRef.close(true);
          this.popUpService.showMsg(
            'ChargePoint Transfer Request Created.',
            AppConstants.EmptyUrl,
            AppConstants.Success,
            AppConstants.Success
          );
        },
        (error) => {
          console.log(error);
          this.popUpService.showMsg(
            'ChargePoint Transfer Request Error.',
            AppConstants.EmptyUrl,
            AppConstants.Error,
            AppConstants.Error
          );
        }
      );
    }
  }
}
