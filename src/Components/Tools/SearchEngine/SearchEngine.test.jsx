import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchEngine from './SearchEngine';

test('exposes and selects autocomplete options with the keyboard', async () => {
  const user = userEvent.setup();
  const onChangeValue = vi.fn();
  render(
    <SearchEngine
      options={['Pikachu', 'Pichu', 'Raichu']}
      onChangeValue={onChangeValue}
      label="Search Pokémon"
      val=""
    />,
  );

  const input = screen.getByRole('combobox', { name: 'Search Pokémon' });
  await user.type(input, 'pi');

  expect(input).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Pikachu' })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  onChangeValue.mockClear();
  await user.keyboard('{ArrowDown}{Enter}');
  expect(onChangeValue).toHaveBeenLastCalledWith('pichu', 13);
  expect(input).toHaveAttribute('aria-expanded', 'false');

  await user.clear(input);
  await user.type(input, 'rai');
  onChangeValue.mockClear();
  await user.click(screen.getByRole('option', { name: 'Raichu' }));
  expect(onChangeValue).toHaveBeenLastCalledWith('raichu', 13);
});
