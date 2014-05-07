
var app = {

  server: 'http://127.0.0.1:3000/classes/messages/',
  roomNames: [],
  friends: {},
  currentRoom: 'room',

  addFriend: function(name){
    app.friends[name] = true;
    $(".friend_list").append("<li>" + name + "</li>");
  },

  addMessage: function(obj){

      var userName = obj.username;
      var messageText= obj.text;
      var time = obj.createdAt;
      // var time = $.timeago(obj.createdAt);

      $("#chats").prepend("<div class='message'></div>");
      $(".message").first().append("<div class=username><a href='#' class=user_link </a>" + "</div>");
      $(".username").find('a').text(userName);
      $(".message").first().append("<div class='time'></div>");
      $(".time").first().text(time);
      $(".message").first().append("<div class='message_text'></div>");
      $(".message_text").first().text(messageText);

      if (app.friends[userName]){
        $(".message_text").first().addClass("friend_message");
      }
  },

  addRoom: function(roomName){

    $(".room_input").val("");

    app.updateCurrentRoom(roomName);

    if(app.roomNames.indexOf(roomName) === -1){
      app.roomNames.push(roomName);
      $("#room_menu").append("<option val="+ roomName + ">"+ roomName + "</option>");
    }

    app.updateCurrentRoom(roomName);
  },

  clearMessages: function() {
    $("#chats").empty();
  },

  fetch: function(){

    $.ajax({
      url: app.server,
      type: 'GET',
      data: {
        order: '-createdAt',
        limit: 10 },
      contentType: 'application/json',
      dataType: 'json',
      success: function (data) {
        console.log(data);
        app.clearMessages();
        if (app.currentRoom === 'room'){
          _.each(data.results, function(obj){
            app.addMessage(obj);
          });
        } else {
          _.each(data.results, function(obj){
            if (obj.roomName === app.currentRoom){
              app.addMessage(obj);
            }
          });
        }
      },

      error: function (data) {
        console.error('chatterbox: Failed to fetch messages');
      }
    });
  },

  init: function(){

    app.fetch();
    setInterval(function(){ app.fetch();}, 2000);

    $("body").on('click', '.chatButton', function(e){
      e.preventDefault();
      // e.stopPropagation();
      var user = window.location.search.split("=")[1];
      var text = $(".message_input").val();


      if (text !==""){

        var message = {
          'username': user,
          'text': text,
          'roomName': app.currentRoom
        };
        app.send(message);

      } else {
        alert("Please enter a message");
      }
    });

    $(".message_input").on('keypress', function(e){
      if(e.keyCode === 13){
        e.preventDefault();
        var user = window.location.search.split("=")[1];
        var text = $(".message_input").val();
        var chatRoom = "chat room";

        if (text !==""){
          var message = {
            'username': user,
            'text': text,
            'roomName': app.currentRoom
          };
          app.send(message);
        } else {
          alert("Please enter a message");
        }
      }
    });

    $("body").on('click', ".roomButton", function(e){
      e.preventDefault();
      var room = $(".room_input").val();

      if (room !==""){
        app.addRoom(room);
      } else {
        alert("Please enter a room name");
      }
    });

    $(".room_input").keypress(function(e){
      if(e.keyCode === 13){
        e.preventDefault();
        var room = $(".room_input").val();
        if (room !==""){
          app.addRoom(room);
        } else {
          alert("Please enter a room name");
        }
      }
    });


    $("body").on("click", ".username", function(){
      var name = $(this).text();
      var answer = confirm("Add " + name + " to friends list?");

      if ( answer && !(name in app.friends )){
        app.addFriend(name);
      }
    });

    $("#room_menu").on('change', function(e) {
      e.preventDefault();
      app.updateCurrentRoom($(this).val());
    });
  },

  send: function(message){

    $(".message_input").val("");

    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      dataType: 'text',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  updateCurrentRoom: function(room){
    app.currentRoom = room;
    $("#room_menu").val(room);
    console.log("changed rooms");
  }

};

// Run the app
$(document).ready(function(){
  app.init();
});
