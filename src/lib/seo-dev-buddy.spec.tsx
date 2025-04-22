import { render } from '@testing-library/react';

import SeoDevBuddy from './seo-dev-buddy';

describe('SeoDevBuddy', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SeoDevBuddy />);
    expect(baseElement).toBeTruthy();
  });
});
