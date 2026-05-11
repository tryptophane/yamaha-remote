import { enableProdMode, importProvidersFrom } from '@angular/core';

import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MatCardModule } from '@angular/material/card';
import { RemoteService } from './app/service/remote-service';
import { environment } from './environments/environment';
import { BasicStatusEffects } from './app/store/effects/basic-status.effects';
import { reducers } from './app/store/reducer';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatInputModule,
      MatIconModule,
      MatSliderModule,
      MatSelectModule,
      MatFormFieldModule,
      MatListModule,
      MatSlideToggleModule,
      MatProgressSpinnerModule,
      MatSnackBarModule,
      MatTooltipModule,
      StoreModule.forRoot(reducers),
      EffectsModule.forRoot([BasicStatusEffects]),
      MatCardModule
    ),
    RemoteService,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
  ]
})
  // eslint-disable-next-line no-console
  .catch(err => console.log(err));
