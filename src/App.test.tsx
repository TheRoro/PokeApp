import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders app title', () => {
  const { getByRole } = render(<App />);
  expect(getByRole('heading', { name: 'PokeApp' })).toBeInTheDocument();
});

test('opens and closes the mobile navigation accessibly', async () => {
  const user = userEvent.setup();
  render(<App />);

  const openButton = screen.getByLabelText('Open navigation menu');
  await user.click(openButton);

  expect(screen.getByRole('dialog', { name: 'Mobile navigation' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveFocus();

  await user.keyboard('{Escape}');
  expect(openButton).toHaveFocus();
});
