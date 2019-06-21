# frozen_string_literal: true
$LOAD_PATH.unshift File.expand_path('../../lib', __FILE__)
require File.expand_path('../../lib/discourse_api', __FILE__)

client = DiscourseApi::Client.new("http://abcdefg.example.com")
client.api_key = "872bce4b5f23f46c7a782cc7511655bcb59c0c427bfa1a0df3c78d984f5c5ef7"
client.api_username = "jineetd"

# search for term
puts client.search("")
