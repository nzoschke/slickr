require 'sinatra'
require 'erb'

get '/' do
  erb :index
end

helpers do
end