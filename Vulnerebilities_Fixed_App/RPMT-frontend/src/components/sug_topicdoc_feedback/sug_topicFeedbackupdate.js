import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Sug_panelmembers_page from "../sug_panelmembers_page/sug_panelmembers_page"

const Sug_Topicdoc_updatefeedback = () => {
     
  const [inputs, setInputs] = useState({});
    const id =useParams().id;
    const history = useNavigate();


    useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:8090/topicdoc_feedback2/${id}`)
        .then((res) => res.data)
        .then(data=>setInputs(data.Feedbacks))
           
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
          .put(`http://localhost:8090/topicdoc_feedback2/${id}`, {
            ResTopicFileGroupId: String(inputs.ResTopicFileGroupId),
            ResTopicFilePanel: String(inputs.ResTopicFilePanel),
            Feedback: String(inputs.Feedback),
            EvaluvatedDate: String(inputs.EvaluvatedDate),
          })
          .then((res) => res.data);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest().then(() => history("/AllTopicDocFeedback"));
      };
    
    
  return (
  
<div>
      <div>
      <Sug_panelmembers_page/>
   <div className='contentsug'>
<div className="col-md-8 mt-4 mx-auto">
    <h1 > Update Given Feedback  Topic Documentation</h1>
    </div>
      {inputs && (
 <form onSubmit={handleSubmit} >

<div class="container contact">
<div class="row">
<div class="col-md-3 sug3">
<div class="contact-info">
<h2>Topic Document</h2>
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
value={inputs. ResTopicFileGroupId}
 onChange={handleChange}

margin="normal"
InputProps={{
        readOnly: true,
      }} fullWidth
 name="ResTopicFileGroupId" disabled/>
</div>
</div>

<div className="form-group"  marginBottom='15px'>

<label class="control-label col-sm-2">Panel </label>
<div class="col-sm-10">
<input type="text" 
className="form-control"
value={inputs.ResTopicFilePanel}
  onChange={handleChange}
margin="normal"
InputProps={{
        readOnly: true,
      }} fullWidth
 name="ResTopicFilePanel" disabled />
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
Update</button>




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

export default Sug_Topicdoc_updatefeedback ;