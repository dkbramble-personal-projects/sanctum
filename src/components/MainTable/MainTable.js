
import CreateTable from "./MainTable.jsx";

function MainTable (props){ 
    if (typeof props.data !== 'undefined'){
      if(props.data.length > 0){
        return CreateTable(props.data);
      }
    } 
    return null;
}
export default MainTable;
