'use client';

import { useEffect, useState } from 'react';
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import { UserDto } from '@/lib/dto/user.dto';
import { Input } from '@nextui-org/react';
import { Pagination } from '@nextui-org/pagination';
import {
  getAmountOfUsers,
  getAmountOfUsersByEmail,
  getPageOfUsers,
  getPageOfUsersByEmail,
} from '@/lib/actions/dashboard';
import Title from '../general/Title';

export default function UserManagementSearch() {
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);

  const [searchType, setSearchType] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchSwitch, setSearchSwitch] = useState<boolean>(false);

  const [query, setQuery] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  function searchByEmail(email: string) {
    const newQuery = email;
    setQuery(newQuery);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    let stype;
    if (newQuery === undefined || newQuery === '') {
      stype = 'all';
    } else {
      stype = 'email';
    }

    const timeoutId = setTimeout(() => {
      setSearchType(stype);
      if (stype === 'email') {
        setSearchValue(newQuery);
      }
      setSearchSwitch(!searchSwitch);
    }, 500);

    setDebounceTimeout(timeoutId);
  }

  const [users, setUsers] = useState<UserDto[]>([]);
  const maxSizePage = 6;

  async function retrieveUsers() {
    switch (searchType) {
      case 'email':
        await getPageOfUsersByEmail(page - 1, maxSizePage, searchValue).then(
          (result) => {
            if (result.isError) {
              setUsers([]);
            } else {
              setUsers(result.users);
            }
          },
        );
        await getAmountOfUsersByEmail(searchValue).then((result) => {
          if (result.isError) {
            setMaxPage(1);
          } else {
            setMaxPage(Math.ceil(result.users / maxSizePage));
          }
        });
        break;
      case 'all':
        await getPageOfUsers(page - 1, maxSizePage).then((result) => {
          if (result.isError) {
            setUsers([]);
          } else {
            setUsers(result.users);
          }
        });
        await getAmountOfUsers().then((result) => {
          if (result.isError) {
            setMaxPage(1);
          } else {
            setMaxPage(Math.ceil(result.users / maxSizePage));
          }
        });
        break;
      default:
        return;
    }
  }

  const updatePage = async (newPage) => {
    if (newPage < 1) {
      setPage(1); // Set to 1 if the new page is less than 1
      return;
    } else if (newPage > maxPage) {
      setPage(maxPage); // Set to maxPage if the new page is greater than maxPage
      return;
    } else {
      setPage(newPage); // Set to newPage if within the valid range
    }
  };

  useEffect(() => {
    retrieveUsers();
  }, [searchSwitch, page]);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center gap-12">
      <Title title="User Management" />
      <Input
        type="email"
        className="w-72"
        placeholder="Search by email"
        onValueChange={(email) => searchByEmail(email)}
      />
      <Pagination
        total={maxPage}
        color="primary"
        page={page}
        onChange={updatePage}
        showControls
        isCompact
        size="lg"
      />
      <div className="flex flex-wrap w-full h-full justify-center items-center">
        {users.map((user) => (
          <UserProfileCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
