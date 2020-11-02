import React, {useState} from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
import axios from 'axios';

async function postTableData (title, type) {
    try{
        await axios.post('http://localhost:8080/todos',    
        {
         "title": title,
         "type": type
       });
    } catch (err){
        alert(err);
    }
}

async function patchTableData (title, type, initialTitle) {
  try{
    await axios.patch('http://localhost:8080/todos/' + initialTitle,    
    {
      "title": title,
      "type": type
    });
  } catch (err){
    alert(err);
  }
}

function NewTodoModal(props) {
    const [show, setShow] = useState(false);
    const [modalTitle, setModalTitle] = useState("New Todo");
  
    const [title, setTitle] = useState("");
    const [type, setType] = useState("Game");
    const [initialTitle, setInitialTitle] = useState("");
  
    const handleClose = () => setShow(false);
    const handleShow = () => {
      if (typeof(props.cellValues) != "undefined"){
        setInitialTitle(props.cellValues.title);
        setTitle(props.cellValues.title);
        setType(props.cellValues.type);
        setModalTitle("Edit Todo");
      }
      setShow(true);
    }
  
    const handleChangeTitle = e => {
      setTitle(e.target.value);
    }
  
    const handleChangeType = e => {
      setType(e.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (props.inTableButton){
          patchTableData(title, type, initialTitle);
        } else{
          postTableData(title, type);
        }
    };
    
    function ModalButton(props){
      if (props.inTableButton){
        return <button type="button" className="btn-block btn-clear-blue" onClick={() => {handleShow()}}> X </button>
      } else {
        return <Button className="btn-sm btn-new my-4" variant="primary" onClick={handleShow}>
            New Todo
        </Button>
      }
    }
  
    return (
      <div>
        <ModalButton inTableButton={props.inTableButton}></ModalButton>
        <Modal
          show={show}
          className="btn-new"
          onHide={handleClose}
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form className="btn-new" onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control className="modalInput" value={title}  type="text" placeholder="Enter title" onChange={handleChangeTitle}/>
            </Form.Group>
  
            <Form.Group controlId="selectType">
              <Form.Label>Type</Form.Label>
              <Form.Control className="modalInput" value={type}  as="select" onChange={handleChangeType}>
                <option>Game</option>
                <option>Movie</option>
                <option>Music</option>
                <option>DLC</option>
                <option>TV</option>
                <option>Mod</option>
                <option>Console</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button> 
          </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  export default NewTodoModal;