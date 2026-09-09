import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogFormComponent } from './catalog-form.component';

describe('CatalogFormComponent', () => {
  let component: CatalogFormComponent;
  let fixture: ComponentFixture<CatalogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('does not emit when the form is invalid', () => {
    let emitted = false;
    component.saved.subscribe(() => emitted = true);

    component.submit();

    expect(emitted).toBeFalse();
    expect(component.form.touched).toBeTrue();
  });

  it('emits a valid drink payload and clears on reset token', () => {
    let payload: { id: number | null; name: string; price: number } | undefined;
    component.saved.subscribe((value) => payload = value);
    component.form.setValue({ name: 'Latte', price: 5 });

    component.submit();
    expect(payload).toEqual({ id: null, name: 'Latte', price: 5 });

    component.resetToken = 1;
    expect(component.form.value).toEqual({ name: '', price: 0 });
    expect(component.editingId).toBeNull();
  });
});
