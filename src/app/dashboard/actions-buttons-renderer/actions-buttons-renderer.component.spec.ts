import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsButtonsRenderer} from './actions-buttons-renderer.component';

describe('ActionsButtonsRendererComponent', () => {
  let component: ActionsButtonsRenderer;
  let fixture: ComponentFixture<ActionsButtonsRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsButtonsRenderer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsButtonsRenderer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
