import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndexedDBService } from '@app/shared/utility/indexed-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  isIframe = false;
  userName = '';

  constructor(public router: Router, private indexedDBService: IndexedDBService) {}

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;
    const user = localStorage.getItem('user');
    if (user) {
      this.indexedDBService.getTableList('PermissionDB').then((data: any) => {
        if (!data.length) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['/']);
        }
      }).catch(error => {
        console.error(error);
      });
    }
  }
}
