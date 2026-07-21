import { useEffect, useMemo, useState } from "react";
import Loader from "./Loader";
import "../assets/css/components/dataTable.css";

export default function DataTable({
  columns = [],
  data = [],
  loading = false,

  searchable = true,
  searchPlaceholder = "Search...",

  searchKey = "id",
  searchKeys = [],

  pageSize = 5,

  rowKey = "id",

  emptyMessage = "No records found.",
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return data;

    return data.filter((row) => {
      const keys =
        searchKeys.length > 0
          ? searchKeys
          : [searchKey];

      return keys.some((key) =>
        String(row[key] ?? "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [data, search, searchKey, searchKeys]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / pageSize)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, data]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex =
    (currentPage - 1) * pageSize;

  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + pageSize
  );

  if (loading) {
    return <Loader text="Loading..." />;
  }

  return (
    <div className="table-container">

      {searchable && (
        <div className="table-header">
          <input
            type="text"
            className="table-search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      )}

      <div className="table-responsive">

        <table className="csms-table">

          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={
                    column.accessor ||
                    column.header
                  }
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>

            {paginatedData.length === 0 ? (
              <tr>
                <td
                  className="empty-state"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map(
                (row, index) => (
                  <tr
                    key={
                      row[rowKey] ??
                      row.requestId ??
                      startIndex + index
                    }
                  >
                    {columns.map(
                      (column) => (
                        <td
                          key={
                            column.accessor ||
                            column.header
                          }
                        >
                          {column.render
                            ? column.render(
                                row,
                                startIndex +
                                  index
                              )
                            : row[
                                column
                                  .accessor
                              ]}
                        </td>
                      )
                    )}
                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

      {filteredData.length > 0 && (
        <div className="table-info">
          Showing
          <strong>
            {" "}
            {startIndex + 1}{" "}
          </strong>
          to
          <strong>
            {" "}
            {Math.min(
              startIndex +
                pageSize,
              filteredData.length
            )}{" "}
          </strong>
          of
          <strong>
            {" "}
            {filteredData.length}{" "}
          </strong>
          entries
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-area">

          <button
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                (page) => page - 1
              )
            }
          >
            Previous
          </button>

          <span>
            Page {currentPage} of{" "}
            {totalPages}
          </span>

          <button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage(
                (page) => page + 1
              )
            }
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}