using StackExchange.Redis;

// just some variable for later
string s;
byte[] bytes;
int number;
bool exists;

#region Connect and PING

// one any one one of these
var redis = ConnectionMultiplexer.Connect($"localhost:6379,password=");

// these are cheap, make as many as you want
var db = redis.GetDatabase();

// ping the database
TimeSpan pong = db.Ping();
Console.WriteLine($"PING returned in {pong.TotalMilliseconds}ms");

#endregion

#region SET and GET a String

db.StringSet("simple:string", "foo");
s = db.StringGet("simple:string")!;

Console.WriteLine($"SET and GET simple:string returned => { s }");

#endregion

#region SET and GET a String containing binary data

db.StringSet("binary:string", new byte[] { 1, 2, 3 });
bytes = db.StringGet("binary:string")!;

Console.WriteLine($"SET and GET binary:string returned => [ { string.Join(", ", bytes) } ]");

#endregion

#region SET, GET, and modify a String containing an integer

// write and read an integer to a string
db.StringSet("number:string", 1);
number = (int) db.StringGet("number:string")!;

Console.WriteLine($"SET and GET number:string returned => { number }");

// increment and read that integer
db.StringIncrement("number:string");
db.StringIncrement("number:string", 5);
db.StringDecrement("number:string");
db.StringDecrement("number:string", 3);
number = (int) db.StringGet("number:string")!;

Console.WriteLine($"INCR, INCRBY, and GET number:string returned => { number }");

#endregion

#region EXISTS

// a key that does exists
exists = db.KeyExists("simple:string");
Console.WriteLine($"EXISTS simple:string returned => { exists }");

// a key that doesn't exists
exists = db.KeyExists("missing:string");
Console.WriteLine($"EXISTS missing:string returned => { exists }");

#endregion

#region DEL (really UNLINK)

// delete a key
db.KeyDelete("binary:string");
exists = db.KeyExists("binary:string");

Console.WriteLine($"DEL and EXISTS binary:string returned => { exists }");

#endregion

#region EXPIRE

// expire a key
db.KeyExpire("number:string", TimeSpan.FromSeconds(10));
var ttl = db.KeyTimeToLive("number:string")!.Value;
Console.WriteLine($"EXPIRE and TTL number:string returned => { ttl.TotalMilliseconds }ms");

#endregion
