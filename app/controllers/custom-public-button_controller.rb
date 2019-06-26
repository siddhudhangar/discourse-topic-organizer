class CustomPublicButtonController < ApplicationController
  def index
    topicRecords = TopicStore.get_topicRecords()

    render json: { topicRecords: topicRecords.values }
  end

  def update
    topic_id = params[:topic_id]
    topicRecord = {
      'id' => topic_id,
      'prior_topic_id' => params[:topicRecord][:prior_topic_id]
    }

    TopicStore.add_topic(topic_id, topicRecord)

    render json: { topicRecord: topicRecord }
  end
end