class TopicStore
	class << self
		def get_topicRecords
			PluginStore.get('discourse-topic-organizer', 'topicRecords') || {}
		end

		def add_topic(topic_id, topicRecord)
			topicRecords = get_topicRecords()
			topicRecords[topic_id] = topicRecord
			PluginStore.set('discourse-topic-organizer', 'topicRecords', topicRecords)

			topicRecord
		end
	end
end