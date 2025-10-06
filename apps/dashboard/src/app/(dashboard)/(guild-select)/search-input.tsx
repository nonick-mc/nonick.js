'use client';

import { SearchIcon, XIcon } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

export function SearchInput() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    const queryString = createQueryString('q', query);
    window.history.replaceState({}, '', queryString ? `${pathname}?${queryString}` : pathname);
  }, [query, pathname, createQueryString]);

  return (
    <InputGroup className='h-10'>
      <InputGroupInput
        placeholder='サーバーを検索'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      {query && (
        <InputGroupAddon align='inline-end'>
          <InputGroupButton onClick={() => setQuery('')} size='icon-sm'>
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
