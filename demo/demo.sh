# clean up from previous runs
rm elvis-lives.jpg

# set the JPG into a key
redis-cli -x set elvis < elvis.jpg

# get the key
redis-cli get elvis

# get the key and save the JPG
redis-cli get elvis > elvis-lives.jpg
