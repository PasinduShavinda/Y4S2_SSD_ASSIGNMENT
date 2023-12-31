import React, { useState, useRef } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";

const API_URL = 'http://localhost:8090';

const MarkingSchemeHome = (props) => {
  const history = useNavigate();
  const [file, setFile] = useState(null); // state for storing actual image
  const [previewSrc, setPreviewSrc] = useState(''); // state for storing previewImage
  const [state, setState] = useState({
    markingscheme: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); // state to show preview only for images
  const dropRef = useRef(); // React ref for managing the hover state of droppable area

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  };

  // Ondrop function
  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);
  
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(pdf|doc|docx)$/));
  };

  const updateBorder = (dragState) => {
    if (dragState === 'over') {
      dropRef.current.style.border = '2px solid #000';
    } else if (dragState === 'leave') {
      dropRef.current.style.border = '2px dashed #e9ebeb';
    }
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    try {
      const { markingscheme } = state;
      if (markingscheme.trim() == '' )  {
        swal("Feilds Cannot Be empty !!", "You Must fill all the feilds !!", "error");
      }else{
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('markingscheme', markingscheme);
  
          await axios.post(`${API_URL}/Mschemeupload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(() => history("/MSchemeList"));
          swal("Successful!", "Marking Scheme Successfully Uploded !!", "success");
        }else{
          swal("Submission Fail !", "You Must Select a File ! Please Upload a file And Try Again !", "error");
        }
      } 
      
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
    }
  };

  return (
    <React.Fragment>
      <div className='container'>
      <center><h1 className="h3 mb-3 font-weight-normal" ><font face = "Comic sans MS" size =""><b>Publish the Marking Scheme</b></font></h1></center> 
      <Form className="search-form" onSubmit={handleOnSubmit}>
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <Row>
          <Col>
            <Form.Group controlId="markingscheme">
              <Form.Control
                type="text"
                name="markingscheme"
                value={state.markingscheme || ''}
                placeholder="Enter description about Marking Scheme"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* File Upload functionality */}

        <div className="upload-section">
        <Dropzone onDrop={onDrop}
        onDragEnter={() => updateBorder('over')}
        onDragLeave={() => updateBorder('leave')}
        >
        {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: 'drop-zone' })} ref={dropRef}>
            <input {...getInputProps()} />
            <p>Drag and drop a file OR click here to select a file</p>
            {file && (
                <div>
                <strong>Selected file:</strong> {file.name}
                </div>
            )}
            </div>
        )}
        </Dropzone>

        </div>
        

        <Button variant="primary" type="submit">
          Submit
        </Button>&nbsp;
        <a href='/MSchemeList'>
      <button type="button" class="btn btn-danger">View</button>
      </a>&nbsp;
        <a href='/dashboard'>
      <button type="button" class="btn btn-secondary">Back</button>
      </a>
      </Form>
      </div>
    </React.Fragment>
  );
};

export default MarkingSchemeHome;