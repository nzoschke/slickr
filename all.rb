begin
  require ::File.expand_path('../env.rb', __FILE__) # 'source' dev environment if present
rescue LoadError
end

begin
  # Require the preresolved locked set of gems.
  require ::File.expand_path('../.bundle/environment', __FILE__)
rescue LoadError
  # Fallback on doing the resolve at runtime.
  require "rubygems"
  require "bundler"
  Bundler.setup
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

SITE = mongo['sites']['jessica']
