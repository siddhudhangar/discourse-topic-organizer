import { withPluginApi } from 'discourse/lib/plugin-api';
import { h } from 'virtual-dom';

export default {
	name: 'myprereq',
	initialize(container)
	{
		
		var current_topic_id;
		var current_topic_url = window.location.href;
		current_topic_id = parseInt(current_topic_url.split('/')[5]);

		console.log("topic="+current_topic_id);
		
		 const store = container.lookup("store:main");
		store.findAll('note')
      .then(result => {
        for (const note of result.content) {

 		if(parseInt(note["id"])==current_topic_id){
         console.log(note["prior_topic_id"]+"   "+note["next_topic_id"]);
     }
        }
      })
      .catch(console.error);
  
	}
};

