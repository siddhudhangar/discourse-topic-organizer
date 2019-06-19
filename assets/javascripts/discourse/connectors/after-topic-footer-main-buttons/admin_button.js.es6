import { withPluginApi } from 'discourse/lib/plugin-api';
import showModal from "discourse/lib/show-modal";

export default {
	name: 'tl-post-lock',
	initialize() {
		withPluginApi('0.8.24', function(api) {
			const user = api.getCurrentUser()

		//	if(user.trust_level >= api.container.lookup('site-settings:main').tl_lock_minimum) {
				// User is allowed to see the button

				api.decorateWidget('topic-admin-menu:adminMenuButtons', (decorator) => {
					// Adds the button to the admin menu
					return {
						icon: 'ban',
						fullLabel: 'tl_post_lock.button_label',
						action: 'actionTlLock'
					}
				})
				
				api.attachWidgetAction('topic-admin-menu', 'actionTlLock', () => {
					// code
				})
				
			//}
		})
	}
}