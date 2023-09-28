import {
  Button,
  FormLabel,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import "./styles/shv_rs_topic.css";
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const Shv_rs_add_rs_topic = () => {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    ResTopicgroupId: "",
    ResTopicsupervisor: "",
    ResTopicresearchArea: "",
    ResTopicResearchTopic: ""
  });

  const [csrfToken, setCsrfToken] = useState('');

  async function getCsrfToken() {
    try {
      const response = await fetch("http://localhost:8090/getToken", {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }
      const parsedResponse = await response.json();
      setCsrfToken(parsedResponse.csrfToken);
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  }

  useEffect(() => {
    getCsrfToken();
  }, []);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };


  const sendRequest = async () => {
    try {
      const name = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
  
      if (inputs.ResTopicgroupId.length === 0 || inputs.ResTopicsupervisor.length === 0 || inputs.ResTopicresearchArea.length === 0 || inputs.ResTopicResearchTopic.length === 0) {
        swal("Fields Cannot Be Empty !!", "You Must Fill All the Fields !!", "error");
      } else if (!name.test(String(inputs.ResTopicsupervisor))) {
        swal("Invalid Supervisor Name !", "Name cannot contain numbers ! Please enter a valid name !", "error");
      } else {

        const fetchPostResponse = await fetch(`http://localhost:8090/resTopics`, {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'xsrf-token': csrfToken,
          },
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify({
            ResTopicgroupId: String(inputs.ResTopicgroupId),
            ResTopicsupervisor: String(inputs.ResTopicsupervisor),
            ResTopicresearchArea: String(inputs.ResTopicresearchArea),
            ResTopicResearchTopic: String(inputs.ResTopicResearchTopic),
          }),
        });
  
        if (fetchPostResponse.ok) {
          swal("Successful!", "Research Topic Successfully Submitted !!", "success");
          history("/RsTopics");
        } else {
          throw new Error('Failed to make POST request');
        }
      }
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest();
  };

  return (
    <div>
    <div className="bodyRsTopic">
    <a href="/stdHome"><button class="previous round">&#8249;</button></a>
              <center>
        <h1 className="h3 mb-3 font-weight-normal"><font face = "Comic sans MS" size ="6"><b>Submit Research Topic</b></font></h1>
         </center> 
    <form onSubmit={handleSubmit}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent={"center"}
        maxWidth={700}
        alignContent={"center"}
        alignSelf="center"
        marginLeft={"auto"}
        marginRight="auto"
        marginTop={5}
      ><br/>
        <FormLabel><b>Group ID</b></FormLabel>
        <TextField className = "textfield"
          value={inputs.ResTopicgroupId}
          onChange={handleChange}
          margin="normal"
          fullWidth
          variant="filled"
          name="ResTopicgroupId"
        /><br/>
        <FormLabel><b>Supervisor's Name</b></FormLabel>
        <TextField className = "textfield"
          value={inputs.ResTopicsupervisor}
          onChange={handleChange}
          margin="normal"
          fullWidth
          variant="filled"
          name="ResTopicsupervisor"
        /><br/>
        <FormLabel><b>Research Area</b></FormLabel>
        <TextField className = "textfield"
          value={inputs.ResTopicresearchArea}
          onChange={handleChange}
          margin="normal"
          fullWidth
          variant="filled"
          name="ResTopicresearchArea"
        /><br/>
        <FormLabel><b>Research Topic</b></FormLabel>
        <TextField className = "textfield"
          value={inputs.ResTopicResearchTopic}
          onChange={handleChange}
          margin="normal"
          fullWidth
          variant="filled"
          name="ResTopicResearchTopic"
        /><br/>
        <br/>
        <Button variant="contained" color="primary" size = "large" type="submit">
          Submit Your Research Topic
        </Button>
      </Box>
    </form>

    </div>
    </div>
  );
};

export default Shv_rs_add_rs_topic;


