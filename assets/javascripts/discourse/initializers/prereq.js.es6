import { withPluginApi } from 'discourse/lib/plugin-api';
import { h } from 'virtual-dom';

// import {current_topic_id} from './admin_button';


var arr = [];
var arr_mapping = {};
var current_topic_id;
var reverse_map = {};
var url_map = new Map();

export default {
	name: 'myprereq',
	initialize(container)
	{
		withPluginApi('0.8.24', function(api) {
				api.decorateWidget('post-stream:before', helper => {
					
				
				var current_topic_url,current_topic_id;
				current_topic_url = window.location.href;
	
				current_topic_id = parseInt(current_topic_url.split('/')[5]);
			//	console.log("topic="+current_topic_id+" "+current_topic_url);
		
				const hostname = window.location.href.split('/');

				var j;

				let url = hostname[0]+'//'+hostname[2]+'/latest.json'

				// const request = async () => {
				// const response = await fetch(url);
				// const json = await response.json();
				fetch(url)
				.then(response => response.json())
				.then(data => {
	
						//console.log(data);
				 var temp = data['topic_list']['topics'];
				//console.log("temp="+temp);
				for (j = 0; j<temp.length; j++) {
					arr_mapping[temp[j].id] = temp[j].title;
					reverse_map[temp[j].title] = temp[j].id;
					//url_map[temp[j].id] = temp[j].slug;
					url_map.set(temp[j].id,temp[j].slug);
					arr.push(temp[j].title);
				//	console.log(temp[j].id);
					}
				//	console.log(url_map.size);

					$("#prereq_list").empty();
					const store = container.lookup("store:main");
					store.findAll('note')
      				.then(result => {
        			for (const note of result.content) {
        				if(parseInt(note["id"])==current_topic_id){
							var prior_ids=note["prior_topic_id"];
       					//	console.log(prior_ids)
       					for(var k=0;k<prior_ids.length;k++){	
       						var idp=parseInt(prior_ids[k]);
					//	console.log("id="+note["id"]+"  "+url_map.get(idp));

							var ref=url_map.get(idp);
							var lname=arr_mapping[idp];
          					var text='<a class="btn btn-warning btn-xs"';
         					text+='href="../';
        					text+=ref;
         					text+='/';
          					text+=idp;
         					text+='">';
         					text+=lname;
         					text+='</a>&nbsp;';
       						//console.log(text);
        					$("#prereq_list").append(text);




							}
						}
        			}
      				})
      				.catch(console.error);

				});
				

					

					
				});

				//postreqs here............................

				api.decorateWidget('post-stream:after', helper => {
					
				
				var current_topic_url,current_topic_id;
				current_topic_url = window.location.href;
	
				current_topic_id = parseInt(current_topic_url.split('/')[5]);
			//	console.log("topic="+current_topic_id+" "+current_topic_url);
		
				const hostname = window.location.href.split('/');

				var j;

				let url = hostname[0]+'//'+hostname[2]+'/latest.json'

				// const request = async () => {
				// const response = await fetch(url);
				// const json = await response.json();
				fetch(url)
				.then(response => response.json())
				.then(data => {
	
					//	console.log(data);
				 var temp = data['topic_list']['topics'];
				//console.log("temp="+temp);
				for (j = 0; j<temp.length; j++) {
					arr_mapping[temp[j].id] = temp[j].title;
					reverse_map[temp[j].title] = temp[j].id;
					//url_map[temp[j].id] = temp[j].slug;
					url_map.set(temp[j].id,temp[j].slug);
					arr.push(temp[j].title);
				//	console.log(temp[j].id);
					}
				//	console.log(url_map.size);

					$("#postreq_list").empty();
					const store = container.lookup("store:main");
					store.findAll('note')
      				.then(result => {
        			for (const note of result.content) {
        				if(parseInt(note["id"])==current_topic_id){
							var prior_ids=note["next_topic_id"];
       					//	console.log(prior_ids)
       					for(var k=0;k<prior_ids.length;k++){	
       						var idp=parseInt(prior_ids[k]);
					//	console.log("id="+note["id"]+"  "+url_map.get(idp));

							var ref=url_map.get(idp);
							var lname=arr_mapping[idp];
          					var text='<a class="btn btn-warning btn-xs"';
         					text+='href="../';
        					text+=ref;
         					text+='/';
          					text+=idp;
         					text+='">';
         					text+=lname;
         					text+='</a>&nbsp;';
       						//console.log(text);
        					$("#postreq_list").append(text);




							}
						}
        			}
      				})
      				.catch(console.error);




				});
				

					

					
				});









	});
		
	}
};

