import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { HttpDataService } from '@app/shared/services/http-data.service';
import { AppConstants } from '@app/constants';
import Helper from '@app/shared/utility/Helper';
import { PopUpService } from '@app/shared/utility/popup.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  user: any;

  constructor(
    private httpDataService: HttpDataService,
    private popUpService: PopUpService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildProfileForm();
    this.getUserProfile();
  }

  getUserProfile() {
    this.httpDataService.get(AppConstants.APIUrlGetUserProfile).subscribe(
      (res: any) => {
        console.log(res);
        this.user = res;
        this.profileForm.setValue({
          name: this.user?.name ? this.user?.name : '',
          email: this.user?.email ? this.user?.email : '',
          phone: this.user?.phone ? this.user?.phone : '',
          address: this.user.address?.street ? this.user.address?.street : '',
          city: this.user.address?.city ? this.user.address?.city : '',
          state: this.user.address?.state ? this.user.address?.state : '',
          zipcode: this.user.address?.zipcode ? this.user.address?.zipcode : '',
          country: this.user.address?.country ? this.user.address?.country : '',
        });
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  ShowHidedata(){
    document.getElementById("EditForm").style.display = "block";
    document.getElementById("DisplayUnit").style.display = "none";
  }

  buildProfileForm() {
    this.profileForm = this.formBuilder.group({
      name: [null, []],
      email: [null, [Validators.required]],
      phone: [null, []],
      address: [null, []],
      city: [null, []],
      state: [null, []],
      zipcode: [null, []],
      country: [null, []],
    });
  }

  get name(): boolean {
    return !Helper.isNullOrWhitespace(this.profileForm.get('name')?.value);
  }

  get email(): boolean {
    return !Helper.isNullOrWhitespace(this.profileForm.get('email')?.value);
  }

  get phone(): boolean {
    return !Helper.isNullOrWhitespace(this.profileForm.get('phone')?.value);
  }

  get address(): boolean {
    return !Helper.isNullOrWhitespace(this.profileForm.get('address')?.value);
  }

  get city(): boolean {
    return !Helper.isNullOrWhitespace(this.profileForm.get('city')?.value);
  }

  get state(): boolean {
    return !Helper.isNullOrWhitespace(this.profileForm.get('state')?.value);
  }

  get zipcode(): boolean {
    return !Helper.isNullOrWhitespace(this.profileForm.get('zipcode')?.value);
  }

  get country(): boolean {
    return !Helper.isNullOrWhitespace(this.profileForm.get('country')?.value);
  }

  updateProfile() {
    const data = {
      name: this.profileForm.get('name')?.value,
      email: this.profileForm.get('email')?.value,
      phone: this.profileForm.get('phone')?.value,
      address: this.profileForm.get('address')?.value,
      city: this.profileForm.get('city')?.value,
      state: this.profileForm.get('state')?.value,
      country: this.profileForm.get('country')?.value,
      zipCode: this.profileForm.get('zipcode')?.value,
    };
    this.httpDataService
      .put(AppConstants.APIUrlUpdateUserProfile, data)
      .subscribe(
        (res: any) => {
          this.popUpService.showMsg(
            'User Profile Updated.',
            AppConstants.EmptyUrl,
            AppConstants.Success,
            AppConstants.Success
          );
          this.getUserProfile();
          document.getElementById("DisplayUnit").style.display = "block";
          document.getElementById("EditForm").style.display = "none";
          
        },
        (err: any) => {
          this.popUpService.showMsg(
            'User Profile Update Error',
            AppConstants.EmptyUrl,
            AppConstants.Error,
            AppConstants.Error
          );
        }
      );
  }
}
