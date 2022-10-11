import { usePagination, useTable } from 'react-table';
import Pagination from './Pagination';
export default function Table({ columns, data, showEmptyRow = true }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    // For pagination
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  );
  const emptyRows = [...Array(pageSize - page.length).keys()];
  return (
    <>
      <table
        className="table table-compact table-zebra w-full"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                <th key={i} {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td key={index} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {showEmptyRow &&
            emptyRows.map((i) => (
              <tr roll="row" key={i}>
                <td role="cell" colSpan={20}>
                  <div className="h-8"></div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination
        {...{
          canPreviousPage,
          canNextPage,
          pageCount,
          pageIndex,
          pageOptions,
          gotoPage,
          previousPage,
          nextPage,
          pageSize,
          setPageSize,
        }}
      />
    </>
  );
}
