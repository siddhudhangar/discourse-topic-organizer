import { current_topic_id } from '../initializers/admin_button';

export default Ember.Controller.extend({
	init() {
		this._super();
		this.set('topicRecords', [])
		this.fetchNotes();
	},

	fetchTopicRecords() {
		this.store.findAll('topicRecord')
			.then(result => {
				for (const topicRecord of result.prior_topic_id) {
					this.topicRecords.pushObject(topicRecord);
				}
			})
			.catch(console.error);
	},

	actions: {
		createTopic(selected_topics) {
			if(!selected_topics)
				return;

			const topicRecord = this.store.createRecord('topicRecord', {
				topic_id: current_topic_id,
				prior_topic_id: selected_topics.id
			});

			topicRecord.save()
				.then(console.log)
				.catch(console.error)
		}
	}
});