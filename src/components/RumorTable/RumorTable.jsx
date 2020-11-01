
import React from "react";
import { useTable,  useFlexLayout }from "react-table";
import BTable from "react-bootstrap/Table"
import axios from 'axios';

async function deleteTableData (title) {
  try
  {
    await axios.delete('http://localhost:8080/rumors/' + title);
  } catch (err) {
      alert(err);
  }
}

function CreateTable(data){
  // console.log(data);
  const columns = [
    {
      Header: ()=><small className="table-header">Rumors</small>,
      accessor: 'rumors',
      columns: [
        {
          Header: ()=><small className="table-header">Title</small>,
          accessor: 'title',
          width: 300,
        },
        {
          Header:  ()=><small className="table-header">Type</small>,
          accessor: 'type',
          maxWidth: 75
        },
        {
          Header:  ()=><small className="table-header">Release Date</small>,
          accessor: 'releaseDate',
          maxWidth: 100
        },
        {
          Header:  ()=><small className="table-header">Delete</small>,
          accessor: 'deleteRow',
          maxWidth: 50,
          Cell: ({ cell }) => (
            <button type="button" className="btn-block btn-clear" onClick={() => {deleteTableData(cell.row.values.title)}}>
              X
            </button>
          )
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
  // initialState: {
  //   sortBy: [
  //       {
  //           id: 'columnId',
  //           desc: false
  //       }
  //   ]

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
