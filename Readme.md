## Package to use redis in node app

Use the package _redisio_

```
npm install redisio
```

## Setup redis container

Redis uses port 6379

```
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

Once container is running go to _localhost:8001_ to see a GUI version of redis

## To use redis in the terminal

```
docker exec -it {{containerId}} bash
redis-cli
```

Container id can be found by running the command

```
docker ps
```

## Datatypes in Redis

### Strings in redis

#### set

To set a _key value_ pair

```
 set {{keyName}} {{Value}}
```

#### get

Fetch a _value_ given _key_

```
 get {{keyName}}
```

#### Good practice for key name in redis

_keyNames_ should be in the form of _{{enitiyName}}:{{id}}_
Example:

```
 set user:1 Ateeth
 get user:1
```

#### nx

This is used to set a key only if the key does not exist

```
 set user:2 John nx
 set user:2 Doe nx
 get user:2
```

The returned value is John
user:2 does not exist at first hence the value is John

The second time user:2 is set to Doe it does not happen as the key user:2 aldready exists and its value is John

This is because of nx added to the set statement

#### mget

To get values of multiple keys at once

```
 mget user:1 user:2
```

The values of user:1 and user:2 are returned

#### mset

Set multiple values at ones

```
 mset car:1 "Mitsubishi" car:2 "Toyota" car:3 "Honda" car:4 "Ford"

 mget car:1 car:2 car:3 car:4
```

#### incr

Can be used to increment key values

```
 set count 0

 incr count

 get count
```

Returned value will be 1

#### decr

Can be used to decrement key values

```
 set count-1 1

 decr count

 get count
```

Returned value will be 0

#### incrby

Can be used to increment key values by specific value

```
 set count-3 0

 incrby count-3 10

 get count-3
```

Returned value will be 10

#### decrby

Can be used to decrement key values by specific value

```
 set count-4 10

 decrby count-4 10

 get count-4
```

Returned value will be 0

#### expire

Can be used to erase value of key after a particular time

```
 expire count-4 10
```

The value of count-4 will expire after 10 seconds

### Lists in Redis

Can be used to implement stacks and queues

#### lpush

Push form the left i.e add element to head of list

```
 lpush messages hey
 lpush messages hello
```

messages will be hello hey

#### rpush

Push from the right i.e adds to tail of list

```
 rpush messages bye
```

messages will be hello hey bye

#### lpop

Removes and returns element from head of list i.e left

```
 lpop messages
```

messages will be hey bye

#### rpop

Removes and returns element from tail of list i.e right

```
 rpop messages
```

messages will be hey

#### llen

To get the length of the list

```
 llen messages
```

#### blop

Similar to lpop that is pop elements from the left of the list but here we can specify a timeout for the command to wait if list is empty

If the list is empty the command will wait timeout seconds within which if we add an element to the list that element will be pop if still within the timeout duration

```
 blpop messages 20
```

Now the command will wait for 20 seconds to pop an element if the list is empty that is within the 20 seconds we add elements it will pop the head

The difference between lpop and blpop is if we use lpop on an empty list output is nil immediately

#### lrange

get the values of list from startIntex to endIndex

Get the values from first index to end of list (can use -1 for last index of list)

```
 lrange messages 0 -1
```

Get the values from first index to index 1 (first 2 elements of the list)

```
 lrange messages 0 1
```

### Delete a key in redis

Use _del_ command

```
 del count
```

The count key will be deleted

### Display keys with specific pattern

Use _KEYS_ command

```
 KEYS msg:*
```

Lists all the keys that start with msg:

```
 KEYS *:*
```

The above snippet lists all the keys

### Sets in Redis

Contains unique elements

#### sadd

Adds a member to set

```
 sadd ip 1
 sadd ip 2
 sadd ip 3
```

#### srem

Removes a key from set

```
 srem ip 2
```

#### scard

Gets size of set

```
 scard ip
```

#### sismember

Checks if a key is part of a set or not

```
 sismember ip 10
```

#### sinter

Gets the intersection of 2 sets

```
 sadd s1 1
 sadd s1 3
 sadd s1 4
 sadd s2 5
 sadd s2 4

 sinter s1 s2
```

Prints 4 which is intersection of s1, s2

### Hashes in Redis

Used to store key value pairs

#### Create hashset

hset command with key value pairs

```
 hset bike:1 model Deimos brand Ergonom type 'Enduro Bikes' price 4972
```

#### Get values based on key

hget command with keyName

```
 hget bike:1 model

 hget bike:1 price
```

#### Get list of all keys and values

hgetall command

```
 hgetall bike:1
```

#### Get values of multiple keys at once

hmget command

```
 hmget bike:1 brand type price
```

#### Increment values of keys

hincrbycommand

```
 hincrby bike:1 price 1000
 hget bike:1 price
```

#### Get list of keys

hkeys command

```
 hkeys bike:1
```

#### Get list of values

hvals command

```
 hvals bike:1
```

### Sorted sets in Redis

Like a priority queue
Very similar to set instead of sadd we use zadd and a score to be given
Elements can be added to the set with a kind of score

#### Add a key to the sorted set

```
 zadd hackers 1940 "Alan Kay"
 zadd hackers 1957 "Sophie Wilson"
 zadd hackers 1953 "Richard Stallman"
 zadd hackers 1949 "Anita Borg"
 zadd hackers 1965 "Yukihiro Matsumoto"
 zadd hackers 1914 "Hedy Lamarr"
 zadd hackers 1916 "Claude Shannon"
 zadd hackers 1969 "Linus Torvalds"
 zadd hackers 1912 "Alan Turing"
```

The elements are present in the sorted set according to the score in increasing order

#### Print values of Sorted set

Use zrange and provide start and end index (-1 can be provided to print till end of sorted set)

```
 zrange hackers 0 -1
```

#### Print values of Sorted set in reverse order

Use zrevrange and provide start and end index (-1 can be provided to print till end of sorted set)

```
 zrevrange hackers 0 -1
```

#### Print the values in sorted set with scores

withscores argument

```
 zrange hackers 0 -1 withscores
```

#### Get rank of a value in sorted set (Similar to its index in the set)

zrank command

```
 zrank hackers "Alan Turing"
```

Output will be 0 as it has lowest score

### Redis Streams

Redis Streams are like an append-only log similar to how stored in kafka

#### Add entry to stream

xadd command

Example :
When our racers pass a checkpoint, we add a stream entry for each racer that includes the racer's name, speed, position, and location ID:

```
 xadd race:france * rider Castilla speed 30.2 position 1 location_id 1
 xadd race:france * rider Norem speed 28.8 position 3 location_id 1
 xadd race:france * rider Prickett speed 29.7 position 2 location_id 1
```

#### Read one or more entries

Starting at a given position and moving forward in time

xread command

#### Read range of entries between supplied entry IDs

xrange command

```
xrange race:france 1692632086370-0 + COUNT 3
```

First 3 records after a timestamp

#### Get length of stream

xlen command

```
xlen race:france
```

### Redis Geospatial Data

Redis geospatial indexes let you store coordinates and search for them.

This data structure is useful for finding nearby points within a given radius or bounding box.

#### geoadd

adds a location to a given geospatial index (note that longitude comes before latitude with this command).

```
geoadd bikes:rentable -122.27652 37.805186 station:1

geoadd bikes:rentable -122.2674626 37.8062344 station:2

geoadd bikes:rentable -122.2469854 37.8104049 station:3
```

#### geosearch

returns locations with a given radius or bounding box
Use _fromlonlat_, _withdist_, _byradius_ arguments

Example to _find all locations within 5 km radius of a given location and return the distance to each location_

```
geosearch bikes:rentable fromlonlat -122.2612767 37.7936847 byradius 5 km withdist
```
