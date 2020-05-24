import { PrefixCurrencyPipe } from './prefix-currency.pipe';

describe('PrefixCurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new PrefixCurrencyPipe();
    expect(pipe).toBeTruthy();
  });
});
