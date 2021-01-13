import { ToHtmlStringPipe } from './to-html-string.pipe';

describe('ToHtmlStringPipe', () => {
  it('create an instance', () => {
    const pipe = new ToHtmlStringPipe();
    expect(pipe).toBeTruthy();
  });
});
