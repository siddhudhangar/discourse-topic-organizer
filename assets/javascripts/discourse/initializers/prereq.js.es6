import { withPluginApi } from 'discourse/lib/plugin-api';
import { h } from 'virtual-dom';
// import {current_topic_id} from './admin_button';
export default {
	name: 'myprereq',
	initialize(container)
	{
		
		// var url='http://localhost:9292/latest.json';
		// fetch(url)
		// .then(response => response.json())
		// .then(data => {
		// $(document).ready(function() {
 
 			  		
		// 		console.log("prereq-initializer");
 	// 		  		var text='<a class="btn btn-warning btn-xs" href="../maths-topic-1-trigonometry/20">prereq1</a>';
 	// 		  		$("#prereq_list").append(text);

 	// 	});
		// });

		var current_topic_id;
		var current_topic_url = window.location.href;
		current_topic_id = parseInt(current_topic_url.split('/')[5]);
	//	arr.splice(arr.indexOf(arr_mapping[current_topic_id]), 1);



		console.log("topic="+current_topic_id);
		

		 const store = container.lookup("store:main");
		store.findAll('note')
      .then(result => {
        for (const note of result.content) {
          //this.notes.pushObject(note);
         // console.log(result);
         // var a=Array.from(note);
        //  console.log(Object.keys(note));
//console.log("id="+note["id"]+"  "+typeof note["id"]);
 		if(parseInt(note["id"])==current_topic_id){
         console.log(note["prior_topic_id"]+"   "+note["next_topic_id"]);
     }
   //      	prelist=Array.from(note["prior_topic_id"]);
   //      	console.log(prelist);
   //      	break;
   //      // 	for(var i=0;i<prelist.length;i++)
   //   		 // {
   //    		// 	console.log("topicid="+prelist[i]+"  type="+typeof prelist[i]);
   //    		// }

   //    	}
        }
      })
      .catch(console.error);
  
	}
};

