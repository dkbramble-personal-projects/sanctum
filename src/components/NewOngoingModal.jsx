import React, {useState} from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
import axios from 'axios';

async function postTableData (title) {
    try{
        await axios.post('http://localhost:8080/ongoing',    
        {
         "title": title
       });
    } catch (err){
        alert(err);
    }
}

async function patchTableData (title, initialTitle) {
  try{
    await axios.patch('http://localhost:8080/ongoing/' + initialTitle,    
    {
      "title": title,
    });
  } catch (err){
    alert(err);
  }
}

function NewOngoingModal(props) {
    const [show, setShow] = useState(false);
  
    const [title, setTitle] = useState("");
    const [initialTitle, setInitialTitle] = useState("");
  
    const handleClose = () => setShow(false);
    const handleShow = () => {
      if (typeof(props.cellValues) != "undefined"){
        setInitialTitle(props.cellValues.title);
        setTitle(props.cellValues.title);
      }
      setShow(true);
    }
  
    const handleChangeTitle = e => {
      setTitle(e.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (props.inTableButton){
          patchTableData(title, initialTitle);
        } else{
          postTableData(title);
        }
    };

    function ModalButton(props){
      if (props.inTableButton){
        return <button type="button" className="btn-block btn-clear-blue" onClick={() => {handleShow()}}> X </button>
      } else {
        return <Button className="btn-sm btn-new my-4" variant="primary" onClick={handleShow}>
            New Ongoing Show
        </Button>
      }
    }
    
    return (
      <>
        <ModalButton inTableButton={props.inTableButton}></ModalButton>
  
        <Modal
          show={show}
          className="btn-new"
          onHide={handleClose}
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>New Ongoing Show</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form className="btn-new" onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control className="modalInput" value={title}  type="text" placeholder="Enter title" onChange={handleChangeTitle}/>
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button> 
          </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  export default NewOngoingModal;