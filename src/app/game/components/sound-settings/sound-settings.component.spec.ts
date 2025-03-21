import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundSettingsComponent } from './sound-settings.component';

describe('SoundSettingsComponent', () => {
  let component: SoundSettingsComponent;
  let fixture: ComponentFixture<SoundSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoundSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoundSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
