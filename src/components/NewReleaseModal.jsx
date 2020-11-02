import React, {useState} from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
import axios from 'axios';

async function postTableData (title, checkDate, type, releaseDate) {
    try{
        await axios.post('http://localhost:8080/releases',    
        {
         "title": title,
         "checkDate": checkDate,
         "type": type,
         "releaseDate": releaseDate
       });
    } catch (err){
        alert(err);
    }

}
async function patchTableData (title, checkDate,type, releaseDate, initialTitle) {
  try{
    await axios.patch('http://localhost:8080/releases/' + initialTitle,    
    {
      "title": title,
      "checkDate": checkDate,
      "type": type,
      "releaseDate": releaseDate
    });
  } catch (err){
    alert(err);
  }
}


function NewReleaseModal(props) {
    const [show, setShow] = useState(false);
  
    const [title, setTitle] = useState("");
    const [checkDate, setCheckDate] = useState("N");
    const [type, setType] = useState("Game");
    const [releaseDate, setReleaseDate] = useState("");
    const [initialTitle, setInitialTitle] = useState("");
  
    const handleClose = () => setShow(false);
    const handleShow = () => {
      if (typeof(props.cellValues) != "undefined"){
        setInitialTitle(props.cellValues.title);
        setTitle(props.cellValues.title);
        setCheckDate(props.cellValues.checkDate);
        setType(props.cellValues.type);
        setReleaseDate(props.cellValues.releaseDate);
      }
      setShow(true);
    }
  
    const handleChangeTitle = e => {
      setTitle(e.target.value);
    }
  
    const handleChangeCheckDate = e => {
      setCheckDate(e.target.value);
    }
  
    const handleChangeType = e => {
      setType(e.target.value);
    }
  
    const handleChangeReleaseDate = e => {
      setReleaseDate(e.target.value);
    }
  
    const handleSubmit = (event) => {
        event.preventDefault();
        var date = releaseDate === "" ? null : releaseDate;
        if (props.inTableButton){
          patchTableData(title, checkDate,type,date,initialTitle);
        } else{
          postTableData(title, checkDate,type,date);
        }
    };

    function ModalButton(props){
      if (props.inTableButton){
        return <button type="button" className="btn-block btn-clear-blue" onClick={() => {handleShow()}}> X </button>
      } else {
        return <Button className="btn-sm btn-new my-4" variant="primary" onClick={handleShow}>
            New Release
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
            <Modal.Title>New Release</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form className="btn-new" onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control className="modalInput" value={title} type="text" placeholder="Enter title" onChange={handleChangeTitle}/>
            </Form.Group>
  
            <Form.Group controlId="selectCheck">
              <Form.Label>Check Date</Form.Label>
              <Form.Control className="modalInput" value={checkDate} as="select" onChange={handleChangeCheckDate}>
                <option>N</option>
                <option>Y</option>
              </Form.Control>
            </Form.Group>
  
            <Form.Group controlId="selectType">
              <Form.Label>Type</Form.Label>
              <Form.Control className="modalInput" value={type} as="select" onChange={handleChangeType}>
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
              <Form.Control  className="modalInput" value={releaseDate} type="text" placeholder="Enter date" onChange={handleChangeReleaseDate} />
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button> 
          </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  export default NewReleaseModal;