
import React from "react";
import { useTable,  useFlexLayout }from "react-table";
import BTable from "react-bootstrap/Table"

function CreateTable(data){
  const columns = [
    {
      Header: ()=><small className="table-header">Releases</small>,
      accessor: 'releases',
      columns: [
        {
          Header: ()=><small className="table-header">Artist</small>,
          accessor: 'artist',
          width: 300,
        },
        {
          Header: ()=><small className="table-header">Title</small>,
          accessor: 'name',
          width: 300,
        },

        {
          Header:  ()=><small className="table-header">Type</small>,
          accessor: 'type',
          maxWidth: 75
        },
        {
          Header:  ()=><small className="table-header">Release Date</small>,
          accessor: 'release_date',
          maxWidth: 100
        }

      ],
    },
  ];
// console.log(columns);
return Table(data, columns);
}
function Table(data, columns) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  },  useFlexLayout)

  // Render the UI for your table
  return (
    <BTable striped bordered variant="dark" size="sm" {...getTableProps()}>
      <thead >
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr  {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </BTable>
  )
}

export default CreateTable;
