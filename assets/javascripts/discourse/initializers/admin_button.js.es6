import { withPluginApi } from 'discourse/lib/plugin-api';
import showModal from "discourse/lib/show-modal";


var arr = [];
var arr_mapping = {};
var current_topic_id;
var reverse_map = {};
var url_map = {};
export default {
	name: 'tl-post-lock',
	initialize() {
		withPluginApi('0.8.24', function(api) {

			const hostname = window.location.href.split('/');

			const user = api.getCurrentUser();

			arr_mapping = {};
			arr=[];		// clears array for a fresh reuse of the plugin

			var j;

			let url = hostname[0]+'//'+hostname[2]+'/latest.json'

			const request = async () => {
				const response = await fetch(url);
				const json = await response.json();

				var temp = json['topic_list']['topics'];
				for (j = 0; j<temp.length; j++) {
					arr_mapping[temp[j].id] = temp[j].title;
					reverse_map[temp[j].title] = temp[j].id;
					url_map[temp[j].id] = temp[j].slug;
					arr.push(temp[j].title);
				}
			}

			request();

			console.log(arr);

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
					var current_topic_url = window.location.href;
					current_topic_id = parseInt(current_topic_url.split('/')[5]);
					arr.splice(arr.indexOf(arr_mapping[current_topic_id]), 1);
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
	arr,
	current_topic_id,
	reverse_map,
	url_map
};