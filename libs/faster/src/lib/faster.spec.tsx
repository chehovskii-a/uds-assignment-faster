import { render } from '@testing-library/react';

import FasterFaster from './faster';

describe('FasterFaster', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FasterFaster />);
    expect(baseElement).toBeTruthy();
  });
});
