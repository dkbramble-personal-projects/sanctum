import React, {useState} from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
import axios from 'axios';

async function postTableData (title, type, releaseDate) {
    try{
        await axios.post('http://localhost:8080/rumors',    
        {
         "title": title,
         "type": type,
         "releaseDate": releaseDate
       });
    } catch (err){
        alert(err);
    }
  }


function NewRumorModal() {
    const [show, setShow] = useState(false);
  
    const [title, setTitle] = useState("");
    const [type, setType] = useState("Game");
    const [releaseDate, setReleaseDate] = useState("");
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    const handleChangeTitle = e => {
      setTitle(e.target.value);
    }
  
    const handleChangeType = e => {
      setType(e.target.value);
    }
  
    const handleChangeReleaseDate = e => {
      setReleaseDate(e.target.value);
    }
  
    const handleSubmit = (event) => {
        event.preventDefault();
        postTableData(title, type,releaseDate );

    };
    
  
    return (
      <>
        <Button className="btn-sm btn-new my-4" variant="primary" onClick={handleShow}>
          New Rumor
        </Button>
  
        <Modal
          show={show}
          className="btn-new"
          onHide={handleClose}
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>New Release</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form className="btn-new" onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control className="modalInput" type="text" placeholder="Enter title" onChange={handleChangeTitle}/>
            </Form.Group>
  
            <Form.Group controlId="selectType">
              <Form.Label>Type</Form.Label>
              <Form.Control className="modalInput" as="select" onChange={handleChangeType}>
                <option>Game</option>
                <option>Movie</option>
                <option>Music</option>
                <option>DLC</option>
                <option>TV</option>
                <option>Mod</option>
                <option>Console</option>
              </Form.Control>
            </Form.Group>
  
            <Form.Group controlId="formDate">
              <Form.Label>Release Date</Form.Label>
              <Form.Control  className="modalInput" type="text" placeholder="Enter date" onChange={handleChangeReleaseDate} />
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button> 
          </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  export default NewRumorModal;