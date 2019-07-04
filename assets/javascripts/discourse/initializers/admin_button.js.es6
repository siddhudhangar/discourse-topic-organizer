import { withPluginApi } from 'discourse/lib/plugin-api';
import showModal from "discourse/lib/show-modal";

var initial_selected_topic_ids_pre = [];
var initial_selected_topics_pre = [];
var initial_selected_topic_ids_post = [];
var initial_selected_topics_post = [];

// var selected_topics_pre = [];
// var selected_topic_ids_pre = [];
// var selected_topics_post = [];
// var selected_topic_ids_post = [];

var arr = [];
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

			// const hostname = window.location.href.split('/');

			const user = api.getCurrentUser();

			// arr_mapping = {};
			// arr=[];		// clears array for a fresh reuse of the plugin

			// var j;

			// let url = hostname[0]+'//'+hostname[2]+'/latest.json'

			// const request = async () => {
			// 	const response = await fetch(url);
			// 	const json = await response.json();

			// 	var temp = json['topic_list']['topics'];
			// 	for (j = 0; j<temp.length; j++) {
			// 		console.log(typeof temp[j].id);
			// 		arr_mapping[temp[j].id] = temp[j].title;
			// 		reverse_map[temp[j].title] = temp[j].id;
			// 		url_map[temp[j].id] = temp[j].slug;
			// 		arr.push(temp[j].title);
			// 	}
			// }


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

					const hostname = window.location.href.split('/');


					arr_mapping = {};
					arr=[];		// clears array for a fresh reuse of the plugin

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
							arr.push(temp[j].title);
						}
						arr.splice(arr.indexOf(arr_mapping[current_topic_id]), 1);
					}

					request();

					const store = container.lookup("store:main");
					store.findAll('note')
				      .then(result => {
				        for (const note of result.content) {
					 		if(parseInt(note["id"])==current_topic_id) {

// 						        initial_selected_topic_ids_pre = note["prior_topic_id"].slice();
// 						        initial_selected_topics_pre = arr_mapping[note["prior_topic_id"]].slice();
// 						        initial_selected_topic_ids_post = note["next_topic_id"].slice();
// 						        initial_selected_topics_post = arr_mapping[note["next_topic_id"]].slice();
					 		
						        var k;
						        for(k = 0; k<note["prior_topic_id"].length; k++) {
						        	if(!initial_selected_topic_ids_pre.includes(note["prior_topic_id"][k])){
							        	initial_selected_topic_ids_pre.push(note["prior_topic_id"][k]);
							        	initial_selected_topics_pre.push(arr_mapping[parseInt(note["prior_topic_id"][k])]);
							        }
						        }
						        
						        for(k = 0; k<note["next_topic_id"].length; k++) {
						        	if(!initial_selected_topic_ids_post.includes(note["next_topic_id"][k])) {
							        	initial_selected_topic_ids_post.push(note["next_topic_id"][k]);
							        	initial_selected_topics_post.push(arr_mapping[parseInt(note["next_topic_id"][k])]);
							        }
						        }

						    }
				        }

				        console.log("pre initial topic ids:");
					 console.log(initial_selected_topic_ids_pre);
					 console.log("post initial topic ids:");
					 console.log(initial_selected_topic_ids_post);

					 
	
				      })
				      .catch(console.error);

					// arr.splice(arr.indexOf(arr_mapping[current_topic_id]), 1);

					// console.log(initial_selected_topics_pre);
					console.log(initial_selected_topic_ids_pre);
					// console.log(initial_selected_topics_post);
					console.log(initial_selected_topic_ids_post);
					/*
						This removes the current page from arr so that it isn't displayed in the autocomplete drop down
					 */
					
					 console.log("pre initial topic ids:");
					 console.log(initial_selected_topic_ids_pre);
					 console.log("post initial topic ids:");
					 console.log(initial_selected_topic_ids_post);


					document.getElementById("myForm").style.display = "block";
				});
				
			}
		});
	}
};

export {
	arr_mapping,
	arr,
	current_topic_id,
	reverse_map,
	url_map,
	initial_selected_topic_ids_post,
	initial_selected_topics_post,
	initial_selected_topic_ids_pre,
	initial_selected_topics_pre
};