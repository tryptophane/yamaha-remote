import { enableProdMode } from '@angular/core';

import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { environment } from './environments/environment';
import { BasicStatusEffects } from './app/store/effects/basic-status.effects';
import { reducers } from './app/store/reducer';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideStore(reducers),
    provideEffects([BasicStatusEffects]),
    provideHttpClient(withInterceptorsFromDi())
  ]
})
  // eslint-disable-next-line no-console
  .catch(err => console.error(err));
