const socket = require('socket.io');
const { USER_EVENT, USER_TYPE} = require('../constants/socketEvents');

module.exports = (http)=>{
    const io = socket(http,{
        cors: {
          origin: "*"
        }
      });
    
    let superUser = false;
    let adminSocketId = "";

    io.on('connection',(sock)=>{

        //available user query on initial connection
        sock.on(USER_EVENT.IS_SUPER_USER_AVAILABLE,()=>{
            io.sockets.emit(USER_EVENT.AVAILABLE_USER,!superUser?USER_TYPE.SUPER_USER:USER_TYPE.USER);
        });


        sock.on(USER_EVENT.SET_SUPER_USER,()=>{
            //set superuser flag & send acknowledgement to user
            if(!superUser){
                superUser=true;
                adminSocketId = sock.id;
                io.to(sock.id).emit(USER_EVENT.SUPER_USER_SET,true);
                io.sockets.emit(USER_EVENT.SUPER_USER_IS_AVAILABLE,false);
            }else{
                io.to(sock.id).emit(USER_EVENT.SUPER_USER_SET,false);
            }
        });

        //on tab close
        sock.on(USER_EVENT.EXIT,()=>{
            //set superuser flag null & alert other users
            superUser=false;
            adminSocketId = "";
            io.sockets.emit(USER_EVENT.SUPER_USER_IS_AVAILABLE,true);
        });

        sock.on('disconnect',()=>{
            if(adminSocketId === sock.id){
                superUser=false;
                adminSocketId = "";
                io.sockets.emit(USER_EVENT.SUPER_USER_IS_AVAILABLE,true);
            }
        });

    })
    return io;
}