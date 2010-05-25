begin
  # Require the preresolved locked set of gems.
  require ::File.expand_path('../.bundle/environment', __FILE__)
rescue LoadError
  # Fallback on doing the resolve at runtime.
  require "rubygems"
  require "bundler"
  Bundler.setup
end

begin
  # 'source' dev environment if present
  require ::File.expand_path('../env.rb', __FILE__)
rescue LoadError
end

require 'web'
run Sinatra::Application