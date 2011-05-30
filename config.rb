# ----------------------------------------------------------------------
# config file for SASS/Compass
# http://beta.compass-style.org/help/tutorials/configuration-reference/
# ----------------------------------------------------------------------
http_path       = "/"
project_path    = "."

sass_dir        = "content/assets/css"
css_dir         = "output/assets/css"
images_dir      = "output/assets/images"
javascripts_dir = "output/assets/js"

# toggle between the sass or scss syntax
preferred_syntax = :sass


line_comments   = false
# build compass for production
# compass compile -e production --force
# other output styles are :nested, :expanded, :compact, or :compressed
# output_style    = (environment == :production) ? :compressed : :expanded
output_style    = :expanded
