
import CreateTable from "./OngoingTable.jsx";

function OngoingTable (props){ 

    if (typeof props.data !== 'undefined'){
      return CreateTable(props.data);
    } 
    else{
      return null;
    }
}
export default OngoingTable;
