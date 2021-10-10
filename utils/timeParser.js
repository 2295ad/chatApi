
 const timeConverter=(timestamp) =>{
    var ts = new Date(timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = ts.getFullYear();
    var month = months[ts.getMonth()];
    var date = ts.getDate();
    var hour = ts.getHours();
    var min = ts.getMinutes();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min ;
    return time;
  }


module.exports = {timeConverter};