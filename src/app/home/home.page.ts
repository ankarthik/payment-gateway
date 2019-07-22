import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';

import { SubscriptionService } from './../api/subscription.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public plans;

  public subscriber = {
    firstName: "",
    surname: "",
    email: "",
    planId: ""
  }

  constructor(private iab: InAppBrowser,
    private subscription: SubscriptionService,
    private spinnerDialog: SpinnerDialog) {
    this.spinnerDialog.show();
    setTimeout(() => {
      this.getPlans();
    }, 5000)
  }

  getPlans() {
    this.subscription.getPlans().subscribe((response) => {
      this.plans = response["plans"];
      this.spinnerDialog.hide();
    }, (error) => {
      console.log(error);
      this.spinnerDialog.hide();
    });
  }

  subscribe(planId) {
    if (this.subscriber.email === "") {
      alert("Please enter all details.");
    } else if (this.subscriber.firstName === "") {
      alert("Please enter all details.");
    } else if (this.subscriber.surname == "") {
      alert("Please enter all details.");
    } else {
      this.spinnerDialog.show();
      this.subscriber.planId = planId;
      this.subscription.createSubscription(this.subscriber).subscribe((response) => {
        const browser = this.iab.create(response['links'][0]['href']);
        this.spinnerDialog.hide();
      }, (error) => {
        this.spinnerDialog.hide();
        this.subscription.errorHandle(error);
      });
    }
  }

}
