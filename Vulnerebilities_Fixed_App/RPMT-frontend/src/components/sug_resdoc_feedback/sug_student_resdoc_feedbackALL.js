import React ,{ useEffect, useState }from 'react'
import axios from "axios"
const URL = "https://af-test-deploy-app.herokuapp.com/resdoc_feedback2";


const Sug_student_resdoc_feedbackALL = () => {

  const [Feedbacks, setfeedbacks] = useState([]);

  useEffect(() => {
    axios.get(URL).then((res) => res.data).then((data) => setfeedbacks(data.Feedbacks));
  }, []);

  console.log(Feedbacks);



  const [filterText, setFilterText] = useState("");

        
  //search..........................

  const filteredItems = Feedbacks.filter((sup) =>
  sup.ResDocFileGroupId.toLocaleLowerCase().includes(filterText)
          
        );
 
   
  const Feedbacksf = filterText ? filteredItems : Feedbacks; 





  return (
    <div >
        <form action="">
        <div class="col-sm-4">
                  <input
                    className="float-right"
                    type="text"
                    placeholder="Search"
                    name="search"
                    class="form-control"
                    onChange={(e) =>
                      setFilterText(e.target.value.toLocaleLowerCase())
                    }/>
                    </div>
                    </form><br/>{" "}
   
    <div >
      
    <h1>All Reserch Document Feedbacks</h1>
    <div >
    <div id="sug_table"> <ul>
      
     <th width={"300px"}>GroupId</th>
     <th width={"300px"}>Supervisor</th>
     <th width={"300px"}>Topic</th>
     <th width={"500px"}>Feedback</th>
     <th width={"300px"}>Evaluvated Date</th>
    
   
     <table>
      {Feedbacksf.map((Feedbacks, i)=>(
        
        <tr  key={i}>
         <td width={"300px"}>{Feedbacks.ResDocFileGroupId}</td>
       <td width={"300px"} >{Feedbacks.ResDocFileSupervisor}</td>
       <td width={"300px"}>{Feedbacks.ResDocFileTopic}</td>
       <td width={"500px"}>{Feedbacks.Feedback}</td>
       <td width={"300px"}>{Feedbacks.EvaluvatedDate}</td>
        </tr>
      ))}
      </table>
      </ul></div>
      </div>
      </div>
      </div>
  )
}

export default Sug_student_resdoc_feedbackALL;