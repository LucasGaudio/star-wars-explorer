import { render, screen } from '@testing-library/react';
import PlanetDetailsPage from '@/app/planets/[name]/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

jest.mock('@/app/store/usePlanetStore', () => ({
  usePlanetsStore: () => ({
    selectedPlanet: { 
      name: 'Tatooine', 
      terrain: 'desert', 
      diameter: '10465', 
      climate: 'arid', 
      films: ['A New Hope'],
      residents: [],
    },
  }),
}));

test('exibe planeta na tela', () => {
  render(<PlanetDetailsPage />);
  expect(screen.getByText('Tatooine')).toBeTruthy();
});
