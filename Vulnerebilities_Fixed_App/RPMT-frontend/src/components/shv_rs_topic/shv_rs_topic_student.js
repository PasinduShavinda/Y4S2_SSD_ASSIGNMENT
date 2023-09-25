
/// Retrieve Page
import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import Table from '@mui/material/Table';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Link, useNavigate } from "react-router-dom";
import "./styles/shv_rs_topic.css";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';

const Shv_rs_topic = (props) => {
  const [csrfToken, setCsrfToken] = useState('');
  const history = useNavigate();

  const { _id, ResTopicgroupId, ResTopicsupervisor, ResTopicresearchArea, ResTopicResearchTopic, createdAt } = props.resTopic;
  async function getCsrfToken() {
    try {
      const response = await fetch("http://localhost:5001/getToken", {
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

  const deleteHandler = async () => {
    swal({
      title: "Are you sure?",
      text: "Once Deleted, You Will Not Be Able To Recover This Research Topic Details !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await fetch(`http://localhost:5001/resTopics/${_id}`, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'xsrf-token': csrfToken,
            },
            credentials: 'include',
            mode: 'cors',
          });

          if (response.ok) {
            swal("Done! Research Topic details have been deleted!", {
              icon: "success",
            });
            history("/");
            history("/RsTopics");
          } else {
            swal("Not deleted! Research Topic details are safe!");
          }
        } catch (error) {
          console.error('Error making DELETE request:', error);
        }
      } else {
        swal("Not deleted! Research Topic details are safe!");
      }
    });
  };

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 100,
    },
  }))(TableCell);


  return (
    <div>
      <center>
        <Table style={{ marginTop: '20px' }}>

          <StyledTableCell align="left" width="220px"
          >
            {ResTopicgroupId}
          </StyledTableCell>

          <StyledTableCell align="left" width="220px"
          >
            {ResTopicsupervisor}
          </StyledTableCell>

          <StyledTableCell align="left" width="220px"
          >
            {ResTopicresearchArea}
          </StyledTableCell>

          <StyledTableCell align="left" width="220px"
          >
            {ResTopicResearchTopic}
          </StyledTableCell>

          <StyledTableCell align="left" width="220px"
          >
            {createdAt}
          </StyledTableCell>

          <StyledTableCell align="right">
            <Button variant="contained" color="warning" LinkComponent={Link} to={`/RsTopics/${_id}`} sx={{ mt: "auto" }}>Update</Button>&nbsp;
            <Button variant="contained" color="error" onClick={deleteHandler} sx={{ mt: "auto" }}>Delete</Button>
          </StyledTableCell>

        </Table>
      </center>
    </div>

  );
};

export default Shv_rs_topic;
