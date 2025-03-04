'use client';

import React, { useEffect } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/button';

/**
 * interface PaginationMenuProps.
 * This is the props for the pagination menu.
 * @param currentPage - The current page number.
 * @param onPageChange - The function to call when the page is changed.
 * @param pageViewSize - The number of pages to show in the menu. This is always required for 2 reasons:
 * 1. The menu is of max size, so the user can't see all the pages, the UI would be too cluttered or
 * either broken. The goal is to show the first and last page, and the current page alongside the following nearby pages.
 * 2. The menu is type mini. The user would only see the closest pages to the current page, so the menu is smaller.
 * This also comes with the benefit of not loading all the pages in the menu, which would be a waste of resources.
 * @param totalPages - Optional. The total number of pages. Required if the menu is of max size. (Complete menu)
 * */
interface PaginationMenuProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  pageViewSize: number; // Required, used by mini and full menu. Shows the limit of the menu current navigation.
  totalPages?: number; // Number of total pages. Required if the menu is of max size. (Complete menu)
}

export default function PaginationMenu({
  currentPage,
  onPageChange,
  pageViewSize,
  totalPages,
}: PaginationMenuProps) {
  const isMiniMenu = totalPages !== undefined;

  const [startPage, setStartPage] = React.useState<number>(1);
  const [endPage, setEndPage] = React.useState<number>(1);
  const [pageList, setPageList] = React.useState<number[]>([]);
  const [outOfLowerBound, setOutOfLowerBound] = React.useState<boolean>(false);
  const [outOfUpperBound, setOutOfUpperBound] = React.useState<boolean>(false);

  useEffect(() => {
    const halfDist = Math.floor(pageViewSize / 2); // For 5 it's 2.
    if (totalPages < pageViewSize) {
      setStartPage(1);
      setEndPage(totalPages);
      setOutOfLowerBound(false);
      setOutOfUpperBound(false);
    } else {
      if (currentPage <= halfDist) {
        setStartPage(1);
        setEndPage(5);
        setOutOfLowerBound(false);
        setOutOfUpperBound(true);
      } else {
        if (currentPage >= totalPages - halfDist) {
          setStartPage(totalPages - pageViewSize + 1);
          setEndPage(totalPages);
          setOutOfLowerBound(true);
          setOutOfUpperBound(false);
        } else {
          setStartPage(currentPage - halfDist);
          setEndPage(currentPage + halfDist);
          setOutOfLowerBound(true);
          setOutOfUpperBound(true);
        }
      }
    }

    const elements: number[] = Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index - 1,
    );
    setPageList(elements);
  }, [
    currentPage,
    pageViewSize,
    isMiniMenu,
    startPage,
    endPage,
    outOfUpperBound,
    outOfLowerBound,
    totalPages,
  ]);

  async function updatePage(newPosition: number) {
    if (newPosition < 1) {
      onPageChange(1);
      return;
    } else if (newPosition > totalPages) {
      onPageChange(totalPages);
      return;
    } else {
      onPageChange(newPosition);
    }
  }

  return (
    <div className="flex flex-row w-full h-full justify-center items-center">
      <div className="flex flex-row justify-center items-center w-fit h-fit">
        <Button
          isIconOnly
          variant="light"
          isDisabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="w-fit h-fit py-1 size-sm"
        >
          {currentPage == 1 ? (
            <ChevronDoubleLeftIcon className="size-5 text-gray-700" />
          ) : (
            <ChevronDoubleLeftIcon className="size-5 text-primary" />
          )}
        </Button>
        <Button
          isIconOnly
          variant="light"
          isDisabled={currentPage === 1}
          onClick={() => updatePage(currentPage - 1)}
          className="w-fit h-fit py-1 mr-2 size-sm"
        >
          {currentPage === 1 ? (
            <ArrowLeftIcon className="size-5 text-gray-700" />
          ) : (
            <ArrowLeftIcon className="size-5 text-primary" />
          )}
        </Button>
      </div>
      <div className="flex flex-row justify-center items-center w-full h-full min-w-[100px] p-2">
        <div className="flex flex-row justify-center items-center w-full h-full p-2 mx-auto">
          {pageList.map((index) => (
            <div
              key={`button-${index + 1}`}
              className="flex flex-col w-[30px] h-[40px] items-center justify-center"
            >
              <button
                onClick={() => {
                  onPageChange(index + 1);
                }}
                className="flex flex-col py-1 mx-2 items-center justify-center"
              >
                {index + 1 == currentPage ? (
                  <p
                    className="text-primary text-xl items-center justify-center underline text-center"
                    key={`p-${index + 1}`}
                  >
                    {index + 1}
                  </p>
                ) : (
                  <p
                    className="text-primary items-center justify-center text-xl text-center"
                    key={`p-${index + 1}`}
                  >
                    {index + 1}
                  </p>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-center items-center w-fit h-fit">
        <Button
          isIconOnly
          variant="light"
          isDisabled={currentPage === totalPages}
          onClick={() => updatePage(currentPage + 1)}
          className="w-fit h-fit py-1 ml-2 size-sm"
        >
          {currentPage === totalPages ? (
            <ArrowRightIcon className="size-5 text-gray-700" />
          ) : (
            <ArrowRightIcon className="size-5 text-primary" />
          )}
        </Button>
        <Button
          isIconOnly
          isDisabled={currentPage === totalPages}
          variant="light"
          onClick={() => onPageChange(totalPages)}
          className="w-fit h-fit py-1 size-sm"
        >
          {currentPage === totalPages ? (
            <ChevronDoubleRightIcon className="size-5 text-gray-700" />
          ) : (
            <ChevronDoubleRightIcon className="size-5 text-primary" />
          )}
        </Button>
      </div>
    </div>
  );
}
