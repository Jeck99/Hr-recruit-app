import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import { DbService } from "app/DbService/DbService";

@Component({
    moduleId: module.id,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] , 
  providers : [DbService]
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private alertService: AlertService ,private Service : DbService
      ) { }

  ngOnInit() {
      // reset login status
    //   this.authenticationService.logout();

    //   // get return url from route parameters or default to '/'
    //   this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }



  
    Login() {     
        debugger;
            const req = this.Service.login("ManagerLogins",this.model);
            req.map(res => <any>res.json()).
            subscribe(res => {
                console.log(res.SessionId);
                 localStorage.setItem('Session',res.SessionId );
                 const expiresAt = JSON.stringify(1000) + new Date().getTime();
                 localStorage.setItem('expires_at', expiresAt);
                 console.log("Succesfully Logged");

                },
            (err : any) => {
            console.log("error : " + err);

            console.log(err.json());

            });
           
    }

}