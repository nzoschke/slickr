require 'sinatra'
require 'erb'
require 'uri'
require 'net/http'
require 'RMagick'
require 'mongo'

get '/' do
  erb :index
end

get '/thumber' do
  # GET http://farm3.static.flickr.com/2786/4320860818_93e359bcdb.jpg, and thumbnail it
  img = Magick::Image::from_blob(http_get(params[:photo_url]).body).first
  img.crop!(110, 20, 150, 150)
  img.resize!(75, 75)
  
  # store in GridFS
  thumb_url = params[:photo_url].gsub(/\.jpg/, "_s.jpg")
  fs.open(thumb_url, 'w', :content_type => 'application/jpg') { |f| f.write img.to_blob }
  redirect "/thumb?thumb_url=#{thumb_url}"
end

get '/thumb' do
  content_type "image/jpeg"
  begin
    return fs.open(params[:thumb_url], 'r').read
  rescue Mongo::GridFileNotFound
    redirect params[:thumb_url]
  end
end

helpers do
  def db
    uri = URI.parse(ENV['MONGO_URL'])
    @db ||= Mongo::Connection.new(uri.host, uri.port).db(uri.path.slice(1..-1))
    @db.authenticate(uri.user, uri.password)
    @db
  end
  
  def fs
    @fs ||= Mongo::GridFileSystem.new(db)
  end
  
  def feed(set_url)
    # http://www.flickr.com/photos/7243296@N02/sets/72157623199241973/ =>
    # http://api.flickr.com/services/feeds/photoset.gne?set=72157623199241973&nsid=7243296@N02&lang=en-us&format=json&jsoncallback=?
    parts = set_url.split '/'
    return "http://api.flickr.com/services/feeds/photoset.gne?set=#{parts[6]}&nsid=#{parts[4]}&lang=en-us&format=json&jsoncallback=?"
  end

  def http_get(url)
    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host, uri.port)
    request = Net::HTTP::Get.new(uri.request_uri)
    http.request(request)
  end
end