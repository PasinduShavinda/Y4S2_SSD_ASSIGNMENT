import React, { useState, useRef } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";

const API_URL = 'http://localhost:8090';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies with the request
});

const TopicHome = (props) => {
  const history = useNavigate();
  const [file, setFile] = useState(null); // state for storing actual image
  const [previewSrc, setPreviewSrc] = useState(''); // state for storing previewImage
  const [state, setState] = useState({
    ResTopicFileGroupId : '',
    ResTopicFileSupervisor: '',
    ResTopicFileTopic: '',
    ResTopicFilePanel: ''
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
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
  };

  const updateBorder = (dragState) => {
    if (dragState === 'over') {
      dropRef.current.style.border = '2px solid #000';
    } else if (dragState === 'leave') {
      dropRef.current.style.border = '2px dashed #e9ebeb';
    }
  };

  const handleOnSubmit = async (event) => {
    const name = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
    event.preventDefault();
  
    try {
      const { ResTopicFileGroupId, ResTopicFileSupervisor, ResTopicFileTopic, ResTopicFilePanel } = state;
      const formData = new FormData();
      if (ResTopicFileGroupId.trim() === '' || ResTopicFileSupervisor.trim() === '' || ResTopicFileTopic.trim() === '' || ResTopicFilePanel.trim() === '') {
        swal("Fields Cannot Be Empty!", "You Must Fill All the Fields!", "error");
      } else if (!name.test(String(ResTopicFileSupervisor))) {
        swal("Invalid Supervisor Name!", "Name cannot contain numbers. Please enter a valid name!", "error");
      } else {
        if (file) {
          formData.append('file', file);
          formData.append('ResTopicFileGroupId', ResTopicFileGroupId);
          formData.append('ResTopicFileSupervisor', ResTopicFileSupervisor);
          formData.append('ResTopicFileTopic', ResTopicFileTopic);
          formData.append('ResTopicFilePanel', ResTopicFilePanel);
  
          await axiosInstance.post(`${API_URL}/TopicUpload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(() => {
            swal("Successful!", "Topic details Document Successfully Submitted !!", "success");
            history("/RsTopiFileList");
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              swal("Unauthorized!", "Please log in to continue.", "error");
            } else {
              swal("Error!", "An error occurred while submitting the document. Please try again later.", "error");
            }
          });
        } else {
          swal("Submission Failed!", "You Must Select a File! Please Upload a File and Try Again!", "error");
        }
      }
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
    }
  };
  

  return (
   
    <React.Fragment>
    <div className='container'><br/>
    <center><h2>Research Topic Details Document Submission</h2></center><br/><br/>
      <Form className="search-form" onSubmit={handleOnSubmit}>
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <Row>    
          <Col>
            <Form.Group controlId="ResTopicFileGroupId">
              <Form.Control
                type="text"
                name="ResTopicFileGroupId"
                value={state.ResTopicFileGroupId || ''}
                placeholder="Enter Group ID"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="ResTopicFileSupervisor">
              <Form.Control
                type="text"
                name="ResTopicFileSupervisor"
                value={state.ResTopicFileSupervisor || ''}
                placeholder="Enter Supervisor"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="ResTopicFileTopic">
              <Form.Control
                type="text"
                name="ResTopicFileTopic"
                value={state.ResTopicFileTopic || ''}
                placeholder="Enter Topic"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="ResTopicFilePanel">
              <Form.Control
                type="text"
                name="ResTopicFilePanel"
                value={state.ResTopicFilePanel || ''}
                placeholder="Enter Panel"
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
        {previewSrc ? (
        isPreviewAvailable ? (
            <div className="image-preview">
            <img className="preview-image" src={previewSrc} alt="Preview" />
            </div>
        ) : (
            <div className="preview-message">
            <p>No preview available for this file</p>
            </div>
        )
        ) : (
        <div className="preview-message">
            <p>Image preview will be shown here after selection</p>
        </div>
        )}
        </div>
        <br/>

        <Button  variant="primary" type="submit" >
          Submit
        </Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <a href='/stdHome'>
        <button type="button" class="btn btn-danger">Back</button>
      </a>

      </Form>
      </div>
    </React.Fragment>
  );
};

export default TopicHome;