import { enableProdMode } from '@angular/core';

import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
  // eslint-disable-next-line no-console
  .catch(err => console.error(err));
