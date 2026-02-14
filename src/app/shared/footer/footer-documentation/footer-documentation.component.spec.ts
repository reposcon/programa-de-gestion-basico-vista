import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterDocumentationComponent } from './footer-documentation.component';

describe('FooterDocumentationComponent', () => {
  let component: FooterDocumentationComponent;
  let fixture: ComponentFixture<FooterDocumentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterDocumentationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
