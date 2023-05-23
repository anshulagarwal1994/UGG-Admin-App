import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConstants } from 'src/app/constants';
import { HttpDataService } from '@app/shared/services/http-data.service';
import { IndexedDBService } from '@app/shared/utility/indexed-db.service';

@Component({
  selector: 'app-users',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {

  roles: any = [];
  subscription: Subscription;
  editRole = false;

  constructor(private httpDataService: HttpDataService, private indexedDBService: IndexedDBService) { }

  ngOnInit(): void {
    this.getRoles();
    this.indexedDBService.getRecordData('PermissionDB', 'permission', 'Role Management').then((data: any) => {
      data.previlleges.forEach((pp: any) => {
        if (pp.key === 'Update Role') {
          this.editRole = pp.value;
        }
      });
    }).catch(error => {
      console.error(error);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getRoles() {
    this.subscription = this.httpDataService
      .get(
        AppConstants.APIUrlGetAllRoles
      )
      .subscribe(
        (res: any) => {
          res.forEach((item: any) => {
            item.rolePermissions.forEach((element: any) => {
              element.all = element.previlleges.filter((x: any) => x.value === false).length;
            });
          });
          this.roles = res;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  checkpermission(dataIndex: any, permission: any, privilege: any) {
    this.roles[dataIndex].rolePermissions.forEach((element: any, index: any) => {
        if (element.feature === permission) {
          element.previlleges.forEach((item: any, innerindex: any) => {
              if (item.key === privilege) {
                if (this.roles[dataIndex].rolePermissions[index].previlleges[innerindex].value) {
                  this.roles[dataIndex].rolePermissions[index].previlleges[innerindex].value = false;
                } else {
                  this.roles[dataIndex].rolePermissions[index].previlleges[innerindex].value = true;
                }
              }
          });
        }
    });
    this.roles[dataIndex].rolePermissions.forEach((element: any) => {
      element.all = element.previlleges.filter((x: any) => x.value === false).length;
    });
  }

  checkallpermission(dataIndex: any, permission: any) {
    this.roles[dataIndex].rolePermissions.forEach((element: any, index: any) => {
      if (element.feature === permission) {
        if (element.all === 0) {
          this.roles[dataIndex].rolePermissions[index].all = -1;
          this.roles[dataIndex].rolePermissions[index].previlleges.forEach((item: any) => {
            item.value = false;
          });
        } else {
          this.roles[dataIndex].rolePermissions[index].all = 0;
          this.roles[dataIndex].rolePermissions[index].previlleges.forEach((item: any) => {
            item.value = true;
          });
        }
      }
    });
  }

  updateRole(index: any) {
    this.subscription = this.httpDataService
      .put(
        AppConstants.APIUrlUpdateRole + this.roles[index].id, this.roles[index]
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          this.getRoles();
        },
        (err) => {
          console.log(err);
        }
      );
  }

}
