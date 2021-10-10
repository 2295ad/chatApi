
const checkCache = (req,res,next)=>{
    const key = req.query.count;
    req.client.get(key,(err,data)=>{
        if(!err && data){
            data = JSON.parse(data);
            res.send({data,...res.locals});
        }else{
            next();
        }
    })
}

 
module.exports = {
    checkCache
}