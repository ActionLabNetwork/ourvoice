# Prisma requires a replica set setup
mongod \
    --replSet rs0 \
    --fork --logpath /proc/1/fd/1 \
    --bind_ip_all
mongosh --eval "
    try {
        rs.status(); 
        print('Replica set already initialized') 
    } catch (e) { 
        print('Initializing replica set'); 
        rs.initiate({
            _id: 'rs0', 
            members: [{_id: 0, host: 'localhost:27017'}]
        });  
    }
"
tail --pid=$(pidof mongod) -f /dev/null
