import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    return {};
  }

  @Get('v/privacy-policy')
  @Render('privacy-policy')
  privacyPolicy() {
    return {};
  }

  @Get('v/new-features')
  @Render('new-feature')
  newFeatures() {
    return {};
  }

  @Get('v/terms-and-conditions')
  @Render('legal')
  termsAndConditions() {
    return {
      title: 'Terms and Conditions',
      description: 'Terms and Conditions for WhereDidISpend app',
      content: `<p>No content on this page yet! Check back later.</p>`,
    };
  }

  @Get('v/delete-account')
  @Render('legal')
  deleteAccount() {
    return {
      title: 'Delete your WhereDidISpend app account',
      description: 'Steps to delete your WhereDidISpend app account.',
      content: `
      <div class="alert alert-warning" role="alert">
        <h4 class="alert-heading">Warning!</h4>
        <p>Deleting your account is irreversible!</p>
        <hr>
        <p class="mb-0">Once you proceed with the account deletion, your account and all of your data will be permanently removed from our servers, and it cannot be recovered.</p>
      </div>
      <div class="alert alert-danger" role="alert">
      Disclaimer: The app owner/developer is not responsible for any kind of data loss resulting from the deletion of your account!
      </div>
      <h1>Delete Account</h1>
      <p>Follow these steps to delete your account.</p>
      <hr />
      <div class="row py-2">
        <div class="col-12 col-md-4 text-center">
          <h4>Step 1: Go to the Profile Screen</h4>
          <p>Tap your profile picture at the top right corner.</p>
          <img src="/static-assets/screenshots/1704878601731_100.png" class="img-fluid screenshot" />
        </div>
        <div class="col-12 col-md-4 text-center">
          <h4>Step 2: Tap on "Delete account"</h4>
          <p>Delete my account.</p>
          <img src="/static-assets/screenshots/1704878690496_100.png" class="img-fluid screenshot" />
        </div>
        <div class="col-12 col-md-4 text-center">
          <h4>Step 3: Confirm Account Deletion</h4>
          <p>Confirm your decision when prompted.</p>
          <img src="/static-assets/screenshots/1704878696594_100.png" class="img-fluid screenshot" />
        </div>
      </div>
      <hr />
      <h4>What happens when you delete your account?</h4>
      <p>Following data is immediately deleted.</p>
      <ul>
        <li>Account</li>
        <li>Transactions</li>        
      </ul>
      <p>Following data is deleted after 60 to 90 days.</p>
      <ul>
        <li>Analytical data collected by Google Analytics. For more info, <a href="https://support.google.com/analytics/answer/7667196?hl=en" target="_blank" rel="noopener noreferrer">click here</a>.</li>
        <li>Crash logs collected by Firebase Crashlytics. For more info, <a href="https://firebase.google.com/support/privacy#data_processing_information" target="_blank" rel="noopener noreferrer">click here</a>.</li>
      </ul>
      `,
    };
  }
}
