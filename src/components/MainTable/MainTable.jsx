import "./MainTable.scss";
import React from "react";
import { useTable,  useFlexLayout }from "react-table";
import BTable from "react-bootstrap/Table"
import axios from 'axios';
import NewReleaseModal from '../NewReleaseModal.jsx'

async function deleteTableData (title) {
  try
  {
    await axios.delete('http://localhost:8080/releases/' + title);
  } catch (err) {
      alert(err);
  }
}

function CreateTable(data){
  const columns = [
    {
      Header: ()=><small className="table-header">Releases</small>,
      accessor: 'releases',
      columns: [
        {
          Header: ()=><small className="table-header">Title</small>,
          accessor: 'title',
          width: 300,
        },

        {
          Header: ()=><small className="table-header">Check?</small>,
          accessor: 'checkDate',
          maxWidth: 70
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
          Header:  ()=><small className="table-header">Days Left</small>,
          accessor: 'daysLeft',
          maxWidth: 75
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
        },
        {
          Header:  ()=><small className="table-header">Edit</small>,
          accessor: 'editRow',
          maxWidth: 50,
          Cell: ({ cell }) => (
              <NewReleaseModal inTableButton={true} cellValues={cell.row.values} ></NewReleaseModal>
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
                if (cell.value != null){
                  var dateTime = Date.parse(cell.value);
                  if (!dateTime.isNaN){
                    var date = new Date(dateTime);
                    if (date != null) {
                      var now = new Date();
                      var yearDiff = date.getFullYear() - now.getFullYear();
                      if (yearDiff === 0){
                        return <td className="blueCell" {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      } else if(yearDiff === 1){
                        return <td className="purpleCell" {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      } else if (yearDiff === 2){
                        return <td className="orangeCell" {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      }

                    }
                  }

                  if (cell.value < 1 && cell.row.values.daysLeft === cell.value){
                    return <td className="greenCell" {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  }
                } 

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
