import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { StoreModule } from '@ngrx/store';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { RemoteService } from './service/remote-service';
import { reducers } from './store/reducer';
import { PlaybackInfoComponent } from './components/playback-info/playback-info.component';
import { VolumeControlComponent } from './components/volume-control/volume-control.component';
import { NetRadioListComponent } from './components/net-radio-list/net-radio-list.component';
import { PlaybackControlComponent } from './components/playback-control/playback-control.component';
import { OptionsComponent } from './components/options/options.component';
import { InputSelectionComponent } from './components/input-selection/input-selection.component';
import { DspSelectionComponent } from './components/dsp-selection/dsp-selection.component';
import { ScenesComponent } from './components/scenes/scenes.component';
import { PlayModeComponent } from './components/play-mode/play-mode.component';
import { SleepComponent } from './components/sleep/sleep.component';
import { CursorControlComponent } from './components/cursor-control/cursor-control.component';
import { RemoteMainComponent } from './components/remote-main/remote-main.component';
import { AppComponent } from './app.component';
import { BasicStatusEffects } from './store/effects/basic-status.effects';
import { FixAmpPipe } from './utils/fix-amp.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RemoteMainComponent,
    PlaybackInfoComponent,
    VolumeControlComponent,
    NetRadioListComponent,
    PlaybackControlComponent,
    OptionsComponent,
    InputSelectionComponent,
    DspSelectionComponent,
    ScenesComponent,
    PlayModeComponent,
    SleepComponent,
    CursorControlComponent,
    FixAmpPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
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
  ],
  providers: [RemoteService],
  bootstrap: [AppComponent]
})
export class AppModule {}
