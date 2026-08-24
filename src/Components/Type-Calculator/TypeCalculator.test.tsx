import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TypeCalculator from './TypeCalculator';

const renderCalculator = (entry: string) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/calc/*" element={<TypeCalculator />} />
      </Routes>
    </MemoryRouter>,
  );

test('reconstructs calculator results from a shareable URL', () => {
  renderCalculator('/calc/results?type1=water&type2=ground');

  expect(screen.getByLabelText('Primary type: Water')).toBeInTheDocument();
  expect(screen.getByLabelText('Secondary type: Ground')).toBeInTheDocument();
});

test('ignores a duplicate secondary type from the URL', () => {
  renderCalculator('/calc/results?type1=fire&type2=fire');

  expect(screen.getByLabelText('Primary type: Fire')).toBeInTheDocument();
  expect(screen.queryByLabelText('Secondary type: Fire')).not.toBeInTheDocument();
});

test('returns to the selector when no valid URL type is provided', () => {
  renderCalculator('/calc/results?type1=unknown&type2=invalid');

  expect(screen.getByRole('heading', { name: 'Type Calculator' })).toBeInTheDocument();
});
