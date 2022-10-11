interface iPagination {
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageCount: number;
  pageIndex: number;
  pageOptions: number[];
  gotoPage: (page: number) => void;
  previousPage: () => void;
  nextPage: () => void;
  pageSize: number;
  setPageSize: (number: number) => void;
}
export default function Pagination(props: iPagination) {
  const {
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
  } = props;
  return (
    <div className="flex flex-col sm:flex-row justify-start items-center sm:justify-end bg-base-100 text-base-content p-4">
      <div className="btn-group">
        <button
          className="btn btn-square"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {'<<'}
        </button>
        <button
          className="btn btn-square"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {'<'}
        </button>
        <button className="btn btn-square w-auto px-2">
          Page {pageIndex + 1} of {pageOptions.length}
        </button>
        <button
          className="btn btn-square"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {'>'}
        </button>
        <button
          className="btn btn-square"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {'>>'}
        </button>
      </div>
      <div className="inline form-control mx-4">
        <label className="label space-x-2">
          <span className="label-text">Go to page: </span>
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            className="input input-bordered w-24 max-w-xs"
          />
        </label>
      </div>{' '}
      <select
        className="select select-bordered w-28 max-w-xs"
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
        }}
      >
        {[5, 10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
}
