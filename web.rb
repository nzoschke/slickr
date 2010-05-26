require 'sinatra'

get '/' do
  erb :index
end

get '/auth' do
  protected!
  redirect '/'
end

post '/thumb' do
  # GET http://farm3.static.flickr.com/2786/4320860818_93e359bcdb.jpg, and square thumbnail it from rubberband selection
  photo_url = URI.extract(params[:photo_url]).first # might have /thumb?url= prepended...
  img = Magick::Image::from_blob(http_get(photo_url).body).first
  img.crop!(params[:x].to_i, params[:y].to_i, params[:width].to_i, params[:width].to_i)
  img.resize!(75, 75)
  
  # store in GridFS
  thumb_url = photo_url.gsub(/\.jpg/, "_s.jpg")
  fs.open(thumb_url, 'w', :content_type => 'application/jpg') { |f| f.write img.to_blob }
  redirect "/thumb?url=#{thumb_url}"
end

get '/thumb' do
  begin
    cache_control :public, :max_age => 604800 # one week
    expires 0, :no_cache, :must_revalidate if authorized?
    content_type "image/jpeg"
    return fs.open(params[:url], 'r').read
  rescue Mongo::GridFileNotFound
    redirect params[:url]
  end
end

delete '/thumb' do
  photo_url = URI.extract(params[:photo_url]).first # might have /thumb?url= prepended...
  thumb_url = photo_url.gsub(/\.jpg/, "_s.jpg")
  fs.delete(thumb_url)
  return 'ok'
end

helpers do
  def db
    uri = URI.parse(ENV['MONGO_URL'])
    @db ||= Mongo::Connection.new(uri.host, uri.port).db(uri.path.slice(1..-1))
    @db.authenticate(uri.user, uri.password)
    @db
  end
  
  def fs
    Mongo::Grid.new(db)
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
  
  def protected!
    unless authorized?
      response['WWW-Authenticate'] = %(Basic realm="Slickr Auth")
      throw(:halt, [401, "Not authorized\n"])
    end
  end

  def authorized?
    @auth ||=  Rack::Auth::Basic::Request.new(request.env)
    @auth.provided? && @auth.basic? && @auth.credentials && @auth.credentials == ['admin', 'admin']
  end
end