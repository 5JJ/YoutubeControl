var self = this;
    var listcheck = null; //list id

    var listsUri = '/api/lists/';
    var videoUri = '/api/videos/';
    var playVideoListIds;
    var o_playVideoListIds;
    var videoNums;
    var o_videoNums;
    var videoIndexes;
    var player;
    var playCurrentNum = 0;
    var playMaxNum;
    var playIndex = 0;
    var vTotal, vIndex;
    var tag;

    function ajaxHelper(uri, method, data) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        });
    }

    function addVideo() {
        var regex = "^https://www.youtube.com/watch?v";
        var url = $('#youtubeURL').val();
        if (url == null) {
            alert("Input the url");
        } else {
            if (listcheck == null) {
                alert("Select the listBox");
            } else {
                var vData = {
                    Uri: $('#youtubeURL').val(),
                    ListId: listcheck
                };
                $('#youtubeURL').val("");

                ajaxHelper(videoUri, 'POST', vData).done(function (val) {
                    var lastvId = $('#videos').children().last().attr('name');
                    
                    $("#videos").append("<li class=\"video\" id='video' name=" + val.vId + ">" +
                        "<div  class='div-layout' width:800px' name='t'>" +
                            "<div style='float:left;' name='t'><img src=" + val.vthumb + " height='94' width='168'></div>" +
                            "<div style='float:left;'><p>" + val.vTitle + "</p>" +
                                "<p id='vNum'> 재생횟수 : " + val.vNum + "</p>" +
                                "<input type='button' class='numButton' value='+'/>" +
                                "<input type='button' class='numButton' value='-'/>" +
                                "<input type='button' class='delButton' value='Del' name='" + val.Id + "'/>" +
                                "<input type='button' class='playButton' value='Play'" +
                                "<meta property=\"og:url\" content=" + val.vLink +
                                "><meta name='index' content=" + vIndex +
                                "><meta property=\"vNum\" content=" + val.vNum +
                                "><meta content=" + val.vId + ">" +
                            "</div></div></li>");

                    o_playVideoListIds.push(val.vId);
                    o_videoNums.push(val.vNum);

                    var Index = jQuery.inArray(lastvId, playVideoListIds);

                    playVideoListIds.splice(Index+1, 0, val.vId);

                    videoNums.splice(Index+1, 0, 1);
                    videoIndexes.push(vTotal);
                    vTotal++;
                    vIndex++;
                });
            }
        }
    }
    function inputListBox() {
        var name = $("#CreateListBox").val();
        //need to check the duplicate
        name.Trim();

        if (name.length > 0) {
            var data = {
                Name: name
            };
            ajaxHelper(listsUri, 'POST', data).done(function (val) {
                $("#listBox").append("<li><div class=\"box\" name=\"" + val.Id + "\">" + val.Name + "</div></li>");

            });

        } 
    }
    function getAllLists() {
         $.getJSON(listsUri, function (data) {
             $.each(data, function (key, val) {
                 $("#listBox").append("<li><div class=\"box\" name=\"" + val.Id + "\">" + val.Name + "</div></li>");
             });
        }).fail(
        function (jqXHR, textStatus, err) {
            alert(err);
        });
    }
//get videos from a selected list
    $(document).delegate('div.box', 'click', function () {
        if (listcheck != $(this).attr("name")) {
            listcheck = $(this).attr("name");
            loadVideos();
        }
    });

    function loadVideos() {
        playVideoListIds = [];
        o_playVideoListIds = [];
        videoNums = [];
        videoIndexes = [];
        o_videoNums = [];
        playIndex = 0;
        vTotal = 0;
        vIndex = 0;
        $("#videos").empty();
        $.getJSON(listsUri + listcheck, function (data) {
            if (data != null) {
                $.each(data, function (key, val) {
                    $("#videos").append("<li class=\"video\" id='video' name=" + val.vId + ">" +
                        "<div class='div-layout' name='t'>" +
                            "<div style='float:left;' name='t'><img src=" + val.vthumb + " height='94' width='168'></div>" +
                            "<div class='div-info'><p>" + val.vTitle + "</p>" +
                                "<p id='vNum'>재생횟수 : " + val.vNum + "</p>" +
                                "<input type='button' class='numButton' value='+'/>" +
                                "<input type='button' class='numButton' value='-'/>" +
                                "<input type='button' class='delButton' value='Del' name='" + val.Id + "'/>" +
                                "<input type='button' class='playButton' value='Play'" +
                                "<meta property=\"og:url\" content=" + val.vLink +
                                "><meta name='index' content=" + vIndex +
                                "><meta property=\"vNum\" content=" + val.vNum +
                                "><meta content=" + val.vId + ">" +
                            "</div></div></li>");
                    playVideoListIds.push(val.vId);
                    o_playVideoListIds.push(val.vId);
                    videoNums.push(val.vNum);
                    o_videoNums.push(val.vNum);
                    videoIndexes.push(vIndex);
                    vIndex++;
                    vTotal++;
                });
                tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

              //  alert(playVideoListIds);
            } 
        }).fail(
            function (jqXHR, textStatus, err) {
                alert(err);
            });
    }
//vNum, val.Id, 
    $(document).delegate('.numButton', 'click', function () {
        var b = $(this).attr('value');
        var v = $(this).parent().children();

        //var vIndex = v.eq(6).attr("content");
        var v_vNum = v.eq(7).attr("content");
        var v_vId = v.eq(8).attr("content");
        if (b == '+') {
            v_vNum++;
        } else if(b == '-'){
            if (v_vNum > 0)
                v_vNum--;
        }
        v.eq(1).text("재생횟수 : "+v_vNum);
        var Index = jQuery.inArray(v_vId, playVideoListIds);
        videoNums[Index] = v_vNum;
        o_videoNums[v.eq(6).attr("content")] = v_vNum;
        playMaxNum = videoNums[playIndex];
        v.eq(7).attr("content", v_vNum);    
    });
//is it need to access the database and update it?
//how about when changing the lists, save all at once?
//or add the video?

    $(document).delegate('.playButton', 'click', function () {
        var v = $(this).parent().children();
        var Index = v.eq(8).attr("content"); //vid
        playIndex = 0;
        playVideoListIds = [];
        videoNums = [];
        videoIndexes = [];

        var tmpIndex = jQuery.inArray(Index, o_playVideoListIds);

        for (var i = tmpIndex; i < o_playVideoListIds.length; i++) {
            playVideoListIds.push(o_playVideoListIds[i]);
            videoNums.push(o_videoNums[i]);
            videoIndexes.push(i);
        }
        for (var i = 0; i < tmpIndex; i++) {
            playVideoListIds.push(o_playVideoListIds[i]);
            videoNums.push(o_videoNums[i]);
            videoIndexes.push(i);
        }
        playMaxNum = videoNums[0];
        player.cueVideoById(playVideoListIds[0]);
        player.playVideo();
    });

//DELETE
    $(document).delegate('.delButton', 'click', function () {
        //function delVideo(id) {
        var v = $(this).parent().children();
        var id = $(this).attr('name');
        var index = v.eq(8).attr('content'); //vID
        
        var data;
        ajaxHelper(videoUri + id, 'DELETE', data).done(function () {
            alert("complete del data");
            //loadVideos(); // change it just erase the specific list
            $("#videos li[name='"+index+"']").remove();
            vTotal--;

            //alert(o_playVideoListIds);
            index = v.eq(8).attr('content');
            var i = jQuery.inArray(index, o_playVideoListIds);
            o_playVideoListIds.splice(i, 1);
            o_videoNums.splice(i, 1);

           // alert(o_playVideoListIds);

            i = jQuery.inArray(index, playVideoListIds);
            playVideoListIds.splice(i, 1);
            videoNums.splice(i, 1);

        });
    });
    function onYouTubePlayerAPIReady() {
        player = new YT.Player('vPlay', {
            height: '480',
            width: '854',
            videoId: playVideoListIds[0],
            events: {
                'onReady' : onReady,
                'onStateChange': onPlayerStateChange
            }
        });
        playMaxNum = videoNums[0];
    }
    function onReady(event) {
        event.target.playVideo();
    }
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.ENDED) {
           
            playCurrentNum++;
            if (playCurrentNum < playMaxNum) {
                player.seekTo(0);

            } else {
                playIndex++;
                if (playIndex >= vTotal) {
                    playIndex = 0;
                }
                player.cueVideoById(playVideoListIds[playIndex]);
                player.playVideo();
                playMaxNum = videoNums[playIndex];
                playCurrentNum = 0;
            }
        }
    }
    $(document).delegate('div.box', 'mouseenter', function () {
        $(this).addClass("box_selecting");
    });
    $(document).delegate('div.box', 'mouseout', function () {
        $(this).removeClass("box_selecting");
    });
    $(document).delegate('li.video', 'click', function () {
    });
    $(document).ready(function(){

        getAllLists();
    });

       