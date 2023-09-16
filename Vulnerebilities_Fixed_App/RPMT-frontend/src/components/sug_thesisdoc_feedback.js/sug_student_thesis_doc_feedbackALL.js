import React ,{ useEffect, useState }from 'react'
import axios from "axios"


const URL = "https://af-test-deploy-app.herokuapp.com/thesisdoc_feedback2";


const Sug_student_AllThesisdocfeedbacks = () => {
  const [Feedbacks, setfeedbacks] = useState([]);
  useEffect(() => {
    axios.get(URL).then((res) => res.data).then((data) => setfeedbacks(data.Feedbacks));
  }, []);
  console.log(Feedbacks);




  const [filterText, setFilterText] = useState("");

        
  //search..........................

  const filteredItems = Feedbacks.filter((sup) =>
  sup.ResThesisFileGroupId.toLocaleLowerCase().includes(filterText)
          
        );
 
   
  const Feedbacksf = filterText ? filteredItems : Feedbacks; 


  return (<div>
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
      
      <h1>All feedbacks given for thesis submitions</h1>
      <div className='container contact'>
    <div id="sug_table"> <ul>
      
     <th width={"200px"}>GroupId</th>
     <th width={"200px"}>Supervisor</th>
     <th width={"400px"}>Feedback</th>
     <th width={"200px"}>EvaluvatedDate</th>
    
  
     <table>
      {Feedbacksf.map((Feedbacks, i)=>(
        
        <tr  key={i}>
           <td width={"200px"}>{Feedbacks.ResThesisFileGroupId}</td>
       <td width={"200px"} >{Feedbacks.ResThesisFileSupervisor}</td>
       <td width={"400px"}>{Feedbacks.Feedback}</td>
       <td width={"200px"}>{Feedbacks.EvaluvatedDate}</td>
        </tr>
      ))}
      </table>
      </ul></div></div></div></div>
  )
}

export default Sug_student_AllThesisdocfeedbacks ;