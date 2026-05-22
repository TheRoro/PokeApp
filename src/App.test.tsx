import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  const { getByRole } = render(<App />);
  expect(getByRole('heading', { name: 'PokeApp' })).toBeInTheDocument();
});
