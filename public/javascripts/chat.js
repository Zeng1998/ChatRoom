$(function () {
    var socket = io();
    var username=$("#username").text();
    // 加入房间
    socket.on('connect',function () {
        socket.emit('join',username);
    })

    // 监听消息
    socket.on('msg', function (name, msg) {
        var message="";
        if(name==username){
            message+='<div class="bubbleItem"><span class="k-name-right">'+name+'</span><span class="bubble rightBubble">'+msg+'<span class="bottomLevel"></span><span class="topLevel"></span></span></div><br>';
        }
        else{
            message+='<div class="bubbleItem"><span class="k-name-left">'+name+'</span><span class="bubble leftBubble">'+msg+'<span class="bottomLevel"></span><span class="topLevel"></span></span></div><br>';
        }
        $('#k-chat-content').append(message);
        // 滚动条保持最下方
        $('#k-chat-content').scrollTop($('#k-chat-content')[0].scrollHeight);
    });

    socket.on('sys',function(sysMsg,users){
        console.log(users)
        $("#k-chat-list").html("<span id=\"k-list-head\">在线列表</span>");
        for(var i=0;i<users.length;i++){
            $("#k-chat-list").append('<div class="k-username-item"><div class="k-avatar"><img src="/images/1.jpg" width="40" height="40" /></div>'+users[i]+'</div>');
        }
    })

    $('#k-send-btn').click(function () {
        var msg = layedit.getContent(index);
        $("#edit").val("")
        index = layedit.build('edit', {
            height: 120,
            tool: [
                , 'face'
            ]
        });
        socket.send(msg);
    });
})