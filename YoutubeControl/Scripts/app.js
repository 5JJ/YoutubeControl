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
    var vTotal;
    var tag;

    function ajaxHelper(uri, method, data) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(error);
        });
    }

    function addVideo() {
        var url = $('#youtubeURL').val();
        if (url == null) {
            alert("Input the url");
        } else {
            if (listcheck == null) {
                alert("Select the listBox");
            } else {
                var data = {
                    Uri: $('#youtubeURL').val(),
                    ListId: listcheck
                };
                $('#youtubeURL').val("");


                ajaxHelper(videoUri, 'POST', data).done(function () {
                    alert(data.vId);
                    // loadVideos();
                    //$("#videos").append("<li class=\"video\" id='video' name=" + val.vId + ">" +
                    //    "<div style='float:left;width:800px' name='t'>" +
                    //        "<div style='float:left;' name='t'><img src=" + val.vthumb + " height='94' width='168'></div>" +
                    //        "<div style='float:left;'><p>" + val.vTitle + "</p>" +
                    //            "재생횟수 : <p id='vNum'>" + val.vNum + "</p>" +
                    //            "<input type='button' class='numButton' value='+'/>" +
                    //            "<input type='button' class='numButton' value='-'/>" +
                    //            "<input type='button' class='delButton' value='Del' name='" + val.Id + "'/>" +
                    //            "<input type='button' class='playButton' value='Play'" +
                    //            "<meta property=\"og:url\" content=" + val.vLink +
                    //            "><meta name='index' content=" + vTotal +
                    //            "><meta property=\"vNum\" content=" + val.vNum +
                    //            "><meta content=" + val.vId + ">" +
                    //        "</div></div></li>");
                    //playVideoListIds.push(val.vId);
                    //videoNums.push(val.vNum);
                    //videoIndexes.push(vTotal);
                    //vTotal++;
                });
                //$.getJSON(videoUrl + )
                
            }
        }
    }
    function inputListBox() {
        var name = $("#CreateListBox").val();
        //need to check the duplicate
        $("#listBox").append("<li><div class=\"box\" name=\"" + name + "\">" + name + "</div></li>");
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
        videoNums = [];
        videoIndexes = [];
        playIndex = 0;
        vTotal = 0;
        $("#videos").empty();
        $.getJSON(listsUri + listcheck, function (data) {
            if (data != null) {
                $.each(data, function (key, val) {
                    $("#videos").append("<li class=\"video\" id='video' name=" + val.vId + ">" +
                        "<div style='float:left;width:800px' name='t'>" +
                            "<div style='float:left;' name='t'><img src=" + val.vthumb + " height='94' width='168'></div>" +
                            "<div style='float:left;'><p>" + val.vTitle + "</p>" +
                                "재생횟수 : <p id='vNum'>" + val.vNum + "</p>" +
                                "<input type='button' class='numButton' value='+'/>" +
                                "<input type='button' class='numButton' value='-'/>" +
                                "<input type='button' class='delButton' value='Del' name='" + val.Id + "'/>" +
                                "<input type='button' class='playButton' value='Play'" +
                                "<meta property=\"og:url\" content=" + val.vLink +
                                "><meta name='index' content=" + vTotal +
                                "><meta property=\"vNum\" content=" + val.vNum +
                                "><meta content=" + val.vId + ">" +
                            "</div></div></li>");
                    playVideoListIds.push(val.vId);
                    videoNums.push(val.vNum);
                    videoIndexes.push(vTotal);
                    vTotal++;
                });
                tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                o_videoNums = videoNums;
                o_playVideoListIds = playVideoListIds;
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
        v.eq(1).text(v_vNum);
        var vIndex = jQuery.inArray(v_vId, playVideoListIds);
        videoNums[vIndex] = v_vNum;
        o_videoNums[v.eq(6).attr("content")] = v_vNum;
        playMaxNum = videoNums[playIndex];
        v.eq(7).attr("content", v_vNum);    
    });
//is it need to access the database and update it?
//how about when changing the lists, save all at once?
//or add the video?

    $(document).delegate('.playButton', 'click', function () {
        var v = $(this).parent().children();
        var vIndex = v.eq(6).attr("content");
 
        var tmplist = o_playVideoListIds;
        var tmp = o_videoNums;
        playIndex = 0;
        playVideoListIds = [];
        videoNums = [];
        videoIndexes = [];

        for (var i = vIndex; i < vTotal; i++) {
            playVideoListIds.push(tmplist[i]);
            videoNums.push(tmp[i]);
            videoIndexes.push(i);
        }
        for (var i = 0; i < vIndex; i++) {
            playVideoListIds.push(tmplist[i]);
            videoNums.push(tmp[i]);
            videoIndexes.push(i);
        }
        playMaxNum = videoNums[0];
        player.cueVideoById(playVideoListIds[0]);
        player.playVideo();
    });

    $(document).delegate('.delButton', 'click', function () {
        //function delVideo(id) {
        var id = $(this).attr('name');
        var index = $(this).parent().children().eq(6).attr('content'); //vTotal
        var data;
        ajaxHelper(videoUri + id, 'DELETE', data).done(function () {
            alert("complete del data");
            loadVideos(); // change it just erase the specific list
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
            //alert(playMaxNum);
            if (playCurrentNum < playMaxNum) {
                player.seekTo(0);

            } else {
                playIndex++;
                if (playIndex >= vTotal) {
                    playIndex = 0;
                }

                //alert(playVideoListIds[playIndex] + " " + playIndex);
                player.cueVideoById(playVideoListIds[playIndex]);
                player.playVideo();
                playMaxNum = videoNums[playIndex];
                playCurrentNum = 0;
            }
        }
    }
    $(document).delegate('div.box', 'mouseenter', function () {
        $(this).addClass("list_selecting");
    });
    $(document).delegate('div.box', 'mouseout', function () {
        $(this).removeClass("list_selecting");
    });
    $(document).delegate('li.video', 'click', function () {
    });
    $(document).ready(function(){

        getAllLists();
    });
   