require 'sinatra'
require 'sinatra/mongo'

get '/' do
  erb :index
end

get '/auth' do
  protected!
  redirect '/'
end

post '/thumb' do
  protected!

  # GET http://farm3.static.flickr.com/2786/4320860818_93e359bcdb.jpg, and square thumbnail it from rubberband selection
  img = Magick::Image::from_blob(open(params[:photo_url]).read).first
  img.crop!(params[:x].to_i, params[:y].to_i, params[:width].to_i, params[:width].to_i)
  img.resize!(75, 75)
  
  # store in GridFS
  gfs.open(thumb_url(params[:photo_url]), 'w', :content_type => 'application/jpg') { |f| f.write img.to_blob }
  redirect "/thumb?url=#{thumb_url(params[:photo_url])}"
end

delete '/thumb' do
  protected!
  gfs.delete(thumb_url(params[:photo_url]))
  return 'ok'
end

get '/thumb' do
  begin
    file = gfs.open(params[:url], 'r')
    cache_control :public, :max_age => 3600
    content_type file.content_type
    file.read
  rescue Mongo::GridFileNotFound
    redirect params[:url]
  end
end

helpers do
  def feed_url(set_url)
    # http://www.flickr.com/photos/7243296@N02/sets/72157623199241973/ =>
    # http://api.flickr.com/services/feeds/photoset.gne?set=72157623199241973&nsid=7243296@N02&lang=en-us&format=json&jsoncallback=?
    parts = set_url.split '/'
    return "http://api.flickr.com/services/feeds/photoset.gne?set=#{parts[6]}&nsid=#{parts[4]}&lang=en-us&format=json&jsoncallback=?"
  end
  
  def thumb_url(photo_url)
    # http://farm3.static.flickr.com/2786/4320860818_93e359bcdb.jpg => http://farm3.static.flickr.com/2786/4320860818_93e359bcdb_s.jpg
    photo_url.gsub(/(_[a-z])?\.jpg$/, '_s.jpg')
  end

  def protected!
    unless authorized?
      response['WWW-Authenticate'] = %(Basic realm="Slickr Auth")
      throw(:halt, [401, "Not authorized\n"])
    end
  end

  def authorized?
    @auth ||=  Rack::Auth::Basic::Request.new(request.env)
    @auth.provided? && @auth.basic? && @auth.credentials && @auth.credentials == SITE['auth']
  end
end