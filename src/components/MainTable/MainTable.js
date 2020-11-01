
import CreateTable from "./MainTable.jsx";

function MainTable (props){ 

    if (typeof props.data !== 'undefined'){
      return CreateTable(props.data);
    } 
    else{
      return null;
    }
}
export default MainTable;
