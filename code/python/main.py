import redis

def waitForKey():
  print('...press the enter key...')
  input()


# region Connect to Redis
r = redis.Redis(host='localhost', port=6379, db=0)
# endregion

# region SADD some strings
r.sadd('some:set', 'alfa')
print(f'SADD some:set alfa')

r.sadd('some:set', 'bravo', 'charlie', 'delta')
print(f'SADD some:set bravo charlie delta')

waitForKey()
# endregion

# region Look at the members with SMEMBERS
members = r.smembers('some:set')
print(f'SMEMBERS some:set returned => {members}')

waitForKey()
# endregion

# region Remove a member with SREM
r.srem('some:set', 'delta')
print(f'SREM some:set delta')

members = r.smembers('some:set')
print(f'SMEMBERS some:set returned => {members}')

waitForKey()
# endregion

# region Test for memberhip with SISMEMBER
isMember = r.sismember('some:set', 'alfa')
print(f'SISMEMBER some:set alfa returned => {isMember}')

waitForKey()
# endregion

# region Check the cardinality with SCARD
cardinality = r.scard('some:set')
print(f'SCARD some:set returned => {cardinality}')

waitForKey()
# endregion

# region Add some binary data to a Set
someBytes = bytes([ 1, 2, 3 ])
r.sadd('binary:set', someBytes)
print(f'SADD binary:set {someBytes}')

members = r.smembers('binary:set')
print(f'SMEMBERS binary:set returned => {members}')

waitForKey()
# endregion

# region Set operations with SUNION, SINTER, and SDIFF
r.sadd('set:a', 'alfa', 'bravo', 'charlie')
print(f'SADD set:a alfa bravo charlie')

r.sadd('set:b', 'bravo', 'charlie', 'delta')
print(f'SADD set:b bravo charlie delta')

waitForKey()

union = r.sunion('set:a', 'set:b')
print(f'SUNION set:a set:b returned => {union}')
waitForKey()

intersection = r.sinter('set:a', 'set:b')
print(f'SINTER set:a set:b returned => {intersection}')
waitForKey()

difference = r.sdiff('set:a', 'set:b')
print(f'SDIFF set:a set:b returned => {difference}')

difference = r.sdiff('set:b', 'set:a')
print(f'SDIFF set:b set:a returned => {difference}')
waitForKey()

# endregion

# region Close down Redis
r.close()
# endregion


