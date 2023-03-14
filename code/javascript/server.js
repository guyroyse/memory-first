import { createClient, commandOptions } from "redis"

const fields = [ 'alfa', 'bravo', 'charlie' ]

// #region Connect to Redis
const redis = createClient()
redis.on('error', err => console.log('Redis Client Error', err))
await redis.connect()
// #endregion

// #region Adding fields to a Hash with HSET
await redis.hSet('some:hash', 'alfa', 'foo')
console.log(`HSET some:hash alfa foo`)

await redis.hSet('some:hash', 'bravo', 'bar')
console.log(`HSET some:hash bravo bar`)

await redis.hSet('some:hash', 'charlie', 'baz')
console.log(`HSET some:hash charlie baz`)

await wait()
// #endregion

// #region Reading fields with HGET
await Promise.all(
  fields.map(async field => {
    const fieldValue = await redis.hGet('some:hash', field)
    console.log(`HGET some:hash ${field} returned =>`, fieldValue)
  }))

await wait()
// #endregion

// #region Removing fields with HDEL
await redis.hDel('some:hash', 'alfa')
console.log(`HDEL some:hash alfa`)

await redis.hDel('some:hash', [ 'bravo', 'charlie' ])
console.log(`HDEL some:hash bravo charlie`)

await Promise.all(
  fields.map(async field => {
    const fieldValue = await redis.hGet('some:hash', field)
    console.log(`HGET some:hash ${field} returned =>`, fieldValue)
  }))

await wait()
// #endregion

// #region Adding fields to a Hash with a JavaScript object
await redis.hSet('numeric:hash', { alfa: 1, bravo: 2, charlie: 3 })
console.log(`HSET numeric:hash alfa 1 bravo 3 charlie 3`)
await wait()

await Promise.all(
  fields.map(async field => {
    const fieldValue = await redis.hGet('numeric:hash', field)
    console.log(`HGET numeric:hash ${field} returned =>`, fieldValue)
  }))

await wait()
// #endregion

// #region Incrementing numbers in Hash fields
await redis.hIncrBy('numeric:hash', 'alfa', 4)
console.log(`HINCRBY numeric:hash alfa 4`)

const fieldValue = await redis.hGet('numeric:hash', 'alfa')
console.log(`HGET numeric:hash alfa returned =>`, fieldValue)

await wait()
// #endregion

// #region Getting the values with HMGET
const fieldValues = await redis.hmGet('numeric:hash', [ 'alfa', 'bravo', 'charlie' ] )
console.log(`HMGET numeric:hash alfa bravo charlie returned =>`, fieldValues)
await wait()
// #endregion

// #region Getting everything with HGETALL
const fieldsAndValues = await redis.hGetAll('numeric:hash')
console.log(`HGETALL numeric:hash returned => `, fieldsAndValues)
await wait()
// #endregion

// #region You can also add binary values to Hashes
const bufferIn = Buffer.from([ 1, 2, 3 ])
await redis.hSet('binary:hash', 'alfa', bufferIn)
console.log(`HSET binary:hash`, bufferIn)

const bufferOut = await redis.hGet(
  commandOptions({ returnBuffers: true }),
  'binary:hash', 'alfa')
console.log(`HGET binary:hash alfa`, bufferOut)
await wait()
// #endregion

// #region Close out of Redis
await redis.quit()
// #endregion


async function wait() {
  const stdin = process.stdin
  console.log("...press the any key...")
  stdin.setRawMode(true)
  stdin.resume()
  return new Promise((resolve) => {
    stdin.on('data', () => {
      console.log()
      stdin.pause()
      stdin.removeAllListeners('data')
      resolve()
    })
  })
}
