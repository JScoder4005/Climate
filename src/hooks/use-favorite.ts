import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalStorage } from './use-local-storage';

interface FavoriteCity {
  id: string;
  query?: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  addedAt: number;
}

export function useFavorite() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>(
    'favorites',
    []
  );
  const queryClient = useQueryClient();

  //logic to get favorites
  const favoritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favorites,
    initialData: favorites,
    staleTime: Infinity,
  });

  //logic to add favorite
  const addFavorite = useMutation({
    mutationFn: async (city: Omit<FavoriteCity, 'id' | 'addedAt'>) => {
      const newFavorite: FavoriteCity = {
        ...city,
        id: `${city.lat}-${city.lon}`,
        addedAt: Date.now(),
      };

      console.log({ fav: newFavorite, city: city });

      //this check if city already exists in favorites
      const exists = favorites.some((fav) => fav.id === newFavorite.id);
      if (exists) return favorites;
      const newFavorites = [...favorites, newFavorite].slice(0, 10);

      setFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['favorites'],
      });
    },
  });

  //logic to remove favorite
  const removeFavorite = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavorites = favorites.filter((city) => city.id !== cityId);

      setFavorites(newFavorites);
      return [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['favorites'],
      });
    },
  });

  return {
    favorites: favoritesQuery.data ?? [],
    addFavorite,
    removeFavorite,
    isFavorite: (lat: number, lon: number) =>
      favorites.some((city) => city.lat === lat && city.lon === lon),
  };
}
