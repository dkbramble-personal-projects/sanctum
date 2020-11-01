
import CreateTable from "./TodoTable.jsx";

function TodoTable (props){ 

    if (typeof props.data !== 'undefined'){
      return CreateTable(props.data);
    } 
    else{
      return null;
    }
}
export default TodoTable;
