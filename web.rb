require 'sinatra'
require 'erb'

get '/' do
  erb :index
end

helpers do
  def feed(set_url)
    # http://www.flickr.com/photos/7243296@N02/sets/72157623199241973/
    # to
    # http://api.flickr.com/services/feeds/photoset.gne?set=72157623199241973&nsid=7243296@N02&lang=en-us&format=json
    parts = set_url.split '/'
    return "http://api.flickr.com/services/feeds/photoset.gne?set=#{parts[6]}&nsid=#{parts[4]}&lang=en-us&format=json"
  end
end