import { IsVerifiedDirective } from '../isVerified/is-verified.directive';

describe('IsVerifiedDirective', () => {
  let el: any;
  it('should create an instance', () => {
    const directive = new IsVerifiedDirective(el);
    expect(directive).toBeTruthy();
  });
});
