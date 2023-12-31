import { Button } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import swal from 'sweetalert';
import DOMPurify from 'dompurify';


const Sug_resdoc_feedback= (props) => {
  const history = useNavigate();
    const { _id,  ResDocFileGroupId,ResDocFileSupervisor, ResDocFileTopic,Feedback,EvaluvatedDate}=props.Feedbacks;
   
 
    const deleteHandler = async () => {
    
     

        swal({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this feedback!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
          
           axios
        .delete(`http://localhost:8090/resdoc_feedback2/${_id}`)
        .then((res) => res.data)
        .then(() => history("/"))
        .then(() => history("/AllResDocFeedback"));
  
            swal("Poof! feedback has been deleted!", {
              icon: "success",
  
       
            });
          } else {
            swal("feedback record is safe!");
          }
        });
    };
    const url ="javascript: alert('XSS attack!')"
    

  return (
    <div >
      <tr>
       <td width={"200px"}>{ResDocFileGroupId}</td>
       <td width={"200px"} >{ResDocFileSupervisor}</td>
       <td width={"200px"}>{ResDocFileTopic}</td>
       <td width={"200px"} dangerouslySetInnerHTML={{ __html: Feedback }}></td>
     
       <td width={"200px"}>{EvaluvatedDate}</td>
       <td width={"200px"}> 
       <a><button class="btn btn-danger" onClick={deleteHandler} ><i class="fa fa-trash-o" aria-hidden="true"></i>delete</button></a> 
        &nbsp;
        
        {/* <a href={DOMPurify.sanitize(_id).replace('javascript:', '')}><button class="btn btn-warning"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> update </button></a></td> */}
<a href={_id}><button class="btn btn-warning"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> update </button></a> </td>
       </tr>
 
        
    </div>
  )
}

export default  Sug_resdoc_feedback;