import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Button } from './ui/button';
import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { useLocationSearch } from '@/hooks/use-weather';
import { useNavigate } from 'react-router';
import { useSearchHistory } from '@/hooks/use-search-history';

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { data: locations, isLoading } = useLocationSearch(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();
  //   console.log({ history, clearHistory, addToHistory });
  //   console.log(lcoations);

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split('|');
    // console.log({ lat, lon, name, state });

    //Add to History when searching

    addToHistory.mutate({
      query: query,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      name: name,
      country: country,
      //   searchedAt: new Date(),
    });

    setOpen(false);

    navigate(`/city/${name}??lat=${lat}&lon=${lon}`);
  };
  return (
    <>
      <Button
        variant={'outline'}
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg-w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search cities...
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search Cities.."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No Cities found.</CommandEmpty>
          )}
          <CommandGroup heading="Favorites">
            <CommandItem>Calendar</CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="React Searches">
            <CommandItem>Calendar</CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}

              {locations.map((location) => {
                return (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}|${location.lon}| ${location.name} | ${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span>{location.name}</span>
                    {locations.state && (
                      <span className="text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {location.country.toUpperCase()}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
