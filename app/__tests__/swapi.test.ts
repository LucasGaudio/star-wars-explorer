import { fetchPlanets } from '@/app/services/swapi';

global.fetch = jest.fn(async (input: RequestInfo | URL) => {
  const url = typeof input === 'string' ? input : input.toString();
  if (url.includes('planets'))
    return {
      ok: true,
      json: async () => ({
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'Tatooine', films: [] }],
      }),
    } as any;
  throw new Error('Unexpected URL');
}) as jest.Mock<Promise<Response>, [input: RequestInfo | URL, init?: RequestInit]>;

test('fetchPlanets retorna lista de planetas', async () => {
  const data = await fetchPlanets(1);
  expect(data.results[0].name).toEqual('Tatooine');
});
