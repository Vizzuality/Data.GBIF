require 'nanoc3/tasks'

task :run do
   %x(rm -rf output)
   %x(compass watch & nanoc3 watch & nanoc3 view & open http://localhost:3000)
end

task :compile do
   %x(rm -rf output)
   %x(compass compile & nanoc3 compile)
   %x(cp -R output/* ../Data.GBIF.heroku/)
   %x(cd ../Data.GBIF.heroku); #& git pull heroku master & git add . -u & git commit -m 'test')
   %(pwd);
end
