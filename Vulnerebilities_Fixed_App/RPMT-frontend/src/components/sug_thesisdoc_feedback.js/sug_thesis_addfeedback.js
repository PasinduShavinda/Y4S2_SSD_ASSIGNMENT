import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import {Box,Button,FormLabel,TextField,} from "@mui/material";
import Sug_supervioser_page from "../sug_supervisor_page/sug_supervisor_page"

const Sug_Thesisdoc_addfeedback = () => {
     
  const [inputs, setInputs] = useState({});
    const id =useParams().id;
    const history = useNavigate();


    useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:8090/thesisdoc_feedback/${id}`)
        .then((res) => res.data)
        .then(data=>setInputs(data.thesis))
           
        };
        fetchHandler()
      }, [id]);

     
      const handleChange = (e) => {
        setInputs((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      };
      const sendRequest = async () => {
        await axios
          .post("http://localhost:8090/thesisdoc_feedback2", {
            ResThesisFileGroupId: String(inputs. ResThesisFileGroupId),
            ResThesisFileSupervisor: String(inputs.ResThesisFileSupervisor),
            Feedback: String(inputs.Feedback),
            EvaluvatedDate: String(inputs.EvaluvatedDate),
          })
          .then((res) => res.data);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest().then(() => history("/AllThesisFeedback"));
      };
    
    
  return (


  

<div>
      <div>
  <Sug_supervioser_page/>
   <div className='contentsug'>
<div className="col-md-8 mt-4 mx-auto">
    <h1 >Give Feedback for Thesis Document</h1>
    </div>
      {inputs && (
 <form onSubmit={handleSubmit} >

<div class="container contact">
<div class="row">
<div class="col-md-3 sug3">
<div class="contact-info">
<h2>Thesis Document</h2>
<h2>Feedback</h2>
<img src="../assets/images/resdocimage.png" width="300" height="300"/>

</div>
</div>


<div class="col-md-9 sug9">
<div class="contact-form">



<div className="form-group"  marginBottom='15px'>

<label class="control-label col-sm-2"> GroupId</label>
<div class="col-sm-10">
<input type="text" 
className="form-control"
value={inputs.ResThesisFileGroupId}
 onChange={handleChange}

margin="normal"
InputProps={{
        readOnly: true,
      }} fullWidth
 name="ResThesisFileGroupId" disabled/>
</div>
</div>

<div className="form-group"  marginBottom='15px'>

<label class="control-label col-sm-2"> Supervisor</label>
<div class="col-sm-10">
<input type="text" 
className="form-control"
value={inputs.ResThesisFileSupervisor}
 onChange={handleChange}
margin="normal"
InputProps={{
        readOnly: true,
      }} fullWidth
 name="ResThesisFileSupervisor" disabled/>
</div>
</div>




<div className="form-group" marginBottom='15px'>
      <label class="control-label col-sm-2">EvaluvatedDate</label>
      <div class="col-sm-10">
     <input type="Date"
       class="form-control"
      value={inputs.EvaluvatedDate}
       onChange={handleChange}
       margin="normal"
      fullWidth
       variant="standard"
       name="EvaluvatedDate"
     />
</div>
</div>

<div className="form-group"  marginBottom='15px'>
<label className= "control-label col-sm-2" for="comment">Feedback</label>
<div class="col-sm-10">
					<textarea class="form-control" 
                    rows="5" 
                    id="message"
                    placeholder="Enter the message . . ."  
                    name="Feedback"
                    value={inputs.Feedback}
                    onChange={handleChange}></textarea>
				  </div>

</div>


</div>

<button  class="btn btn-dark btn-lg" type="submit" marginBottom='15px'>

&nbsp;
Save</button>




</div>
</div>

</div>
</form>
 )}
</div>
</div>
</div>










  );
};

export default Sug_Thesisdoc_addfeedback;