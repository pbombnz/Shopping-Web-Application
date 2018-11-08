import { TestBed } from '@angular/core/testing';

import { CartPageService } from './cart-page.service';

describe('CartPageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CartPageService = TestBed.get(CartPageService);
    expect(service).toBeTruthy();
  });
});
