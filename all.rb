begin
  require ::File.expand_path('../env.rb', __FILE__) # 'source' dev environment if present
rescue LoadError => e
end

require 'bson'
require 'erb'
require 'mongo'
require 'net/http'
require 'RMagick'
require 'uri'

require 'sinatra'
require 'sinatra/mongo'
require 'web'

# load site definition
begin
  SITE = doc if doc # from mongo
  require ::File.expand_path('../site.rb', __FILE__) unless doc # 'source' dev site
  SITE # assert
rescue LoadError, NameError => e
  abort('Can not set SITE via MONGO_URL query string or SITE global')
end
