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

  @Get('v/whatsapp')
  @Render('whatsapp-index')
  whatsappIndex() {
    return {};
  }

  @Get('v/whatsapp/opt-in-out-instructions')
  @Render('whatsapp-template')
  whatsappSupport() {
    return {
      title: 'WhereDidISpend on Whatsapp: Opt-In/Out Instructions',
      description:
        'Instructions for Opting in and out of WhereDidISpend services offered on Whatsapp',
      content: `<section>
        <h2>About WhereDidISpend on WhatsApp</h2>
        <p>By Opting-In for this feature, users of WhereDidISpend app can share
          a screenshot of their UPI payment to our WhatsApp business account and
          we'll automatically add transaction details in your WhereDidISpend app
          account.</p>
      </section>
      <hr />
      <section id='opt-in'>
        <h3>Opt-In</h3>
        <p>Here's how to Opt-In for this feature from WhereDidISpend mobile app:</p>
        <div class='row'>
          <div class='col-12 mt-4 col-md-4 text-center'>
            <h4>Step 1: Open App Settings</h4>
            <p>Open
              <strong>WhereDidISpend</strong>
              app in your smartphone and tap on your profile picture.</p>
            <img
              src='/static-assets/screenshots/whatsapp-feature/1.png'
              class='screenshot'
            />
          </div>
          <div class='col-12 mt-4 col-md-4 text-center'>
            <h4>Step 2: Tap on "Add via WhatsApp"</h4>
            <p>Tap on the "Add via WhatsApp" to open Opt-In/Out screen.</p>
            <img
              src='/static-assets/screenshots/whatsapp-feature/2.png'
              class='screenshot'
            />
          </div>
          <div class='col-12 mt-4 col-md-4 text-center'>
            <h4>Step 3: Toggle "Enable"</h4>
            <p>Toggle the "Enable" switch to start Opt-In process. You will be
              asked to enter your WhatsApp number.</p>
            <img
              src='/static-assets/screenshots/whatsapp-feature/3.png'
              class='screenshot'
            />
          </div>
          <div class='col-12 mt-4 col-md-4 text-center'>
            <h4>Step 4: Enter you WhatsApp number</h4>
            <p>Enter your WhatsApp number from which you'll send us your UPI
              payment screenshots.</p>
            <img
              src='/static-assets/screenshots/whatsapp-feature/4.png'
              class='screenshot'
            />
          </div>
          <div class='col-12 mt-4 col-md-4 text-center'>
            <h4>Step 5: Send OTP</h4>
            <p>Tap on "Send OTP on WhatsApp" button to receive an OTP on your
              WhatsApp number for verification.</p>
            <img
              src='/static-assets/screenshots/whatsapp-feature/5.png'
              class='screenshot'
            />
          </div>
          <div class='col-12 mt-4 col-md-4 text-center'>
            <h4>Step 6: Verify OTP</h4>
            <p>Enter received OTP and tap on the "Verify OTP" button.</p>
            <img
              src='/static-assets/screenshots/whatsapp-feature/6.png'
              class='screenshot'
            />
          </div>
          <div class='col-12 mt-4 col-md-4 text-center'>
            <h4>Step 7: Done</h4>
            <p>You've successfully opted-in for this feature.</p>
            <img
              src='/static-assets/screenshots/whatsapp-feature/7.png'
              class='screenshot'
            />
          </div>
        </div>
      </section>
      <hr />
      <section id='opt-out' class='mt-5'>
        <h3>Opt-Out</h3>
        <p>Here's how to Opt-Out of this feature from WhereDidISpend mobile app:</p>
        <div class='row'>
          <div class='col-12 mt-4 col-md-4 text-center'>
            <h4>Step 1: Open App Settings</h4>
            <p>Open
              <strong>WhereDidISpend</strong>
              app in your smartphone and tap on your profile picture.</p>
            <img
              src='/static-assets/screenshots/whatsapp-feature/1.png'
              class='screenshot'
            />
          </div>
          <div class='col-12 mt-4 col-md-4 text-center'>
            <h4>Step 2: Tap on "Add via WhatsApp"</h4>
            <p>Tap on the "Add via WhatsApp" to open Opt-In/Out screen.</p>
            <img
              src='/static-assets/screenshots/whatsapp-feature/2.png'
              class='screenshot'
            />
          </div>
          <div class='col-12 mt-4 col-md-4 text-center'>
            <h4>Step 3: Toggle "Enable"</h4>
            <p>Toggle the "Enable" switch to start Opt-Out process. An alert
              will pop up.</p>
            <img
              src='/static-assets/screenshots/whatsapp-feature/7.png'
              class='screenshot'
            />
          </div>
          <div class='col-12 mt-4 col-md-4 text-center'>
            <h4>Step 4: Opt-Out</h4>
            <p>Read the warning carefully and tap on Opt-Out.</p>
            <img
              src='/static-assets/screenshots/whatsapp-feature/8.png'
              class='screenshot'
            />
          </div>
          <div class='col-12 mt-4 col-md-4 text-center'>
            <h4>Step 5: Done</h4>
            <p>You've successfully opted-out of this feature.</p>
            <img
              src='/static-assets/screenshots/whatsapp-feature/3.png'
              class='screenshot'
            />
          </div>
        </div>
      </section>`,
    };
  }
}
