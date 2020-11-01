
import CreateTable from "./RumorTable.jsx";

function RumorTable (props){ 

    if (typeof props.data !== 'undefined'){
      return CreateTable(props.data);
    } 
    else{
      return null;
    }
}
export default RumorTable;
