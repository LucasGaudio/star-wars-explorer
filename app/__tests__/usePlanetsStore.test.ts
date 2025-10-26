import { usePlanetsStore } from '@/app/store/usePlanetStore';

test('store inicializa com estado vazio', () => {
  const state = usePlanetsStore.getState();
  expect(state.planets).toEqual([]);
  expect(state.selectedPlanet).toBeNull();
});

test('store atualiza planets', async () => {
  usePlanetsStore.setState({ planets: [{ name: 'Alderaan' } as any] });
  const { planets } = usePlanetsStore.getState();
  expect(planets[0].name).toBe('Alderaan');
});
