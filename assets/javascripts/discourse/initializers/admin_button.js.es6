import { withPluginApi } from 'discourse/lib/plugin-api';
import showModal from "discourse/lib/show-modal";

var initial_selected_topic_ids_pre = new Set();
var initial_selected_topics_pre = new Set();
var initial_selected_topic_ids_post = new Set();
var initial_selected_topics_post = new Set();

var init_arr = [];
var arr_mapping = {};
var current_topic_id;
var reverse_map = {};
var url_map = {};
export default {
	name: 'tl-post-lock',
	initialize(container) {
		withPluginApi('0.8.24', function(api) {

			// const store = container.lookup("store:main");
			// store.findAll('note')
		 //      .then(result => {
		 //        for (const note of result.content) {

			//  		if(parseInt(note["id"])==current_topic_id){
			// 	        console.log(note["prior_topic_id"]+"   "+note["next_topic_id"]);
			// 	    }
		 //        }
		 //      })
		 //      .catch(console.error);

			const hostname = window.location.href.split('/');

			const user = api.getCurrentUser();

			arr_mapping = {};
			init_arr=[];		// clears array for a fresh reuse of the plugin

			var j;

			let url = hostname[0]+'//'+hostname[2]+'/latest.json'

			const request = async () => {
				const response = await fetch(url);
				const json = await response.json();

				var temp = json['topic_list']['topics'];
				for (j = 0; j<temp.length; j++) {
					console.log(typeof temp[j].id);
					arr_mapping[temp[j].id] = temp[j].title;
					reverse_map[temp[j].title] = temp[j].id;
					url_map[temp[j].id] = temp[j].slug;
					init_arr.push(temp[j].title);
				}
			}

			request();

			console.log(init_arr);

			if(user.trust_level >= api.container.lookup('site-settings:main').topic_organizer_tl_lock_minimum) {
				// User is allowed to see the button

				api.decorateWidget('topic-admin-menu:adminMenuButtons', (decorator) => {
					// Adds the button to the admin menu
					return {
						icon: 'tasks',
						fullLabel: 'tl_post_lock.button_label',
						action: 'actionTlLock'
					}
				});
				
				api.attachWidgetAction('topic-admin-menu', 'actionTlLock', () => {
					console.log("topic organizer opened!");
					var current_topic_url = window.location.href;
					current_topic_id = parseInt(current_topic_url.split('/')[5]);

					const store = container.lookup("store:main");
					store.findAll('note')
				      .then(result => {
				        for (const note of result.content) {
					 		if(parseInt(note["id"])==current_topic_id) {
						        initial_selected_topic_ids_pre = note["prior_topic_id"];
						        //initial_selected_topics_pre = arr_mapping[note["prior_topic_id"]];
						        initial_selected_topic_ids_post = note["next_topic_id"];
						        //initial_selected_topics_post = arr_mapping[note["next_topic_id"]];
						        var temp=Array.from(initial_selected_topic_ids_pre);
						        var k=0;
						        for( k=0 ; k<note["prior_topic_id"].length; k++)
						        {
						        	initial_selected_topics_pre.add(arr_mapping[parseInt(note["prior_topic_id"][k])]);
						        }

						        var temp=Array.from(initial_selected_topic_ids_post);
						        var k=0;
						        for( k=0 ; k<note["next_topic_id"].length; k++)
						        {
						        	initial_selected_topics_post.add(arr_mapping[parseInt(note["next_topic_id"][k])]);
						        }
						        

						    }
				        }
				      })
				      .catch(console.error);

					init_arr.splice(init_arr.indexOf(arr_mapping[current_topic_id]), 1);
					/*
						This removes the current page from arr so that it isn't displayed in the autocomplete drop down
					 */
					document.getElementById("myForm").style.display = "block";
				});
				
			}
		});
	}
};

export {
	arr_mapping,
	init_arr,
	current_topic_id,
	reverse_map,
	url_map,
	initial_selected_topic_ids_post,
	initial_selected_topics_post,
	initial_selected_topic_ids_pre,
	initial_selected_topics_pre
};