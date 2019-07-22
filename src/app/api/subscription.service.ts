import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private access_token: string;

  constructor(private http: HttpClient, private iab: InAppBrowser) {
    this.getAccessToken();
  }

  getAccessToken() {
    this.http.post('https://api.sandbox.paypal.com/v1/oauth2/token', `grant_type=${'client_credentials'}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic QVJXZmwwVXd0T21mN1RZWEo1RXJSUFpzZE95OEJrd29kLXRzcVhFMnV5bXhIQ0h0ZFFQMndBRlhCOEtFdlptVzRVT2JOU2h3QUUxY2FZdkU6RUhFc2hpYk9fZnYweVBXeFdnTGtLR29HQ0pGdmI2V2tNVHFOS3ZKMl9YaHAycjhLUy1oQzNTVVlUMS1OOEhWUTdDUnhQaEtiY1JvVHlzcWc=',
      })
    }).subscribe((response) => {
      this.access_token = 'Bearer ' + response["access_token"];
      console.log(this.access_token);
    }, (error) => {
      this.errorHandle(error);
    });
  }

  getPlans() {
    console.log(this.access_token);
    return this.http.get('https://api.sandbox.paypal.com/v1/billing/plans', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.access_token,
      })
    });
  }

  createSubscription(subscriber) {
    const d = new Date();
    const isoDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString();
    let body = {
      "plan_id": subscriber.planId,
      "start_time": isoDate,
      "subscriber": {
        "name": {
          "given_name": subscriber.firstName,
          "surname": subscriber.surName
        },
        "email_address": subscriber.email
      },
      "auto_renewal": true,
      "application_context": {
        "brand_name": "example",
        "locale": "en-US",
        "shipping_preference": "SET_PROVIDED_ADDRESS",
        "user_action": "SUBSCRIBE_NOW",
        "payment_method": {
          "payer_selected": "PAYPAL",
          "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED"
        },
        "return_url": "https://humnce.com/returnUrl",
        "cancel_url": "https://humnce.com/cancelUrl"
      }
    }
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.access_token,
        'Accept': 'application/json',
        'PayPal-Request-Id': 'SUBSCRIPTION-21092019-001',
        'Prefer': 'return=representation'
      })
    };
    return this.http.post("https://api.sandbox.paypal.com/v1/billing/subscriptions", body, headers);
  }

  errorHandle(error) {
    console.log(error);
    if (error.status === 401) {
      this.getAccessToken();
    }
  }
}
