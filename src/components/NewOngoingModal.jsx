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

function NewOngoingModal() {
    const [show, setShow] = useState(false);
  
    const [title, setTitle] = useState("");
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    const handleChangeTitle = e => {
      setTitle(e.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        postTableData(title);
    };
    
  
    return (
      <>
        <Button className="btn-sm btn-new my-4" variant="primary" onClick={handleShow}>
          New Ongoing Show
        </Button>
  
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
              <Form.Control className="modalInput" type="text" placeholder="Enter title" onChange={handleChangeTitle}/>
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button> 
          </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  export default NewOngoingModal;