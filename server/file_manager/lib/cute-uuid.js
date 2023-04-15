function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function cute_uid(prefix = ""){
  cute_arr = Array('rabbit','cat','dog','panda','chicken','ikun','dolphin','crab','whale','shark','frog','monkey','sjc');
  cute_v = Array('eat', 'kick', 'love', 'ask', 'get', 'invite', 'permit','add','call','break','control','drink','enjoy');
  cute_adj = Array('happy','cute','lovely','sweet','beautiful','amazing','big','small','south','east','west','north');
  cute_pre = Array('by','to','from','for','with');

  uuid  = cute_adj[rand(0,     cute_adj.length - 1)];
  uuid += '-'+cute_arr[rand(0, cute_arr.length -1)];
  uuid += '-'+cute_v[rand(0,   cute_v.length -1)];
  uuid += '-'+cute_adj[rand(0, cute_adj.length-1)];
  uuid += '-'+cute_arr[rand(0, cute_arr.length-1)];
  uuid += '-'+cute_pre[rand(0, cute_pre.length-1)];
  uuid += '-'+cute_v[rand(0,   cute_v.length-1)];
  uuid += '-'+cute_adj[rand(0, cute_adj.length-1)];
  uuid += '-'+cute_arr[rand(0, cute_arr.length-1)];
  uuid += '-'+rand(0,9)+rand(0,9)+rand(0,9)+rand(0,9);
  return prefix + uuid;
}

// console.log(cute_uid(''))
exports.uuid_cute = cute_uid