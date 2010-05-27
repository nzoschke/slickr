require 'sinatra/base'
require 'mongo'

module Sinatra
  module MongoHelper
    def mongo
      options.mongo
    end
  end

  module MongoExtension
    def mongo=(url)
      @mongo = nil
      @gfs = nil
      @doc = nil
      set :mongo_url, url
      mongo
    end

    def mongo
      synchronize do
        @mongo ||= (
          url = URI(mongo_url)
          slash, db, coll = url.path.split '/'
          connection = Mongo::Connection.new(url.host, url.port)
          mongo = connection.db(db, mongo_settings)
          if url.user && url.password
            mongo.authenticate(url.user, url.password)
          end
          mongo
        )
      end
    end
          
    def gfs
      synchronize do
        Mongo::Grid.new(mongo)
        @gfs ||= Mongo::GridFileSystem.new(mongo)
      end
    end
    
    def doc
      synchronize do
        @doc ||= (
          url = URI(mongo_url)
          slash, db, coll = url.path.split '/'
          return nil unless coll and url.query
          query = url.query.split '='
          mongo[coll].find(Hash[query]).first
        )
      end
    end

    protected

    def self.registered(app)
      app.set :mongo_url, ENV['MONGO_URL'] || 'mongo://127.0.0.1:27017/default'
      app.set :mongo_settings, Hash.new
      app.helpers MongoHelper
    end

  end

  register MongoExtension

end