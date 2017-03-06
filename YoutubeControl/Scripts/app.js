﻿var self = this;
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
            alertMessage(errorThrown);
        });
    }

    function addVideo() {
        var regex = "^https://www.youtube.com/watch?v";
        var url = $('#youtubeURL').val();
        if (url.length <= 0) {
            alertMessage("Input the YOUTUBE URL.");
        } else {
            if (url.match(regex) == null) {
                alertMessage("PLEASE CHECK your YOUTUBE URI.");
            }
            else if (listcheck == null) {
                alertMessage("BEFORE INPUT url, PLEASE SELECT the listBox.");
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
    function addListBox() {
        var name = $("#CreateListBox").val();
        //need to check the duplicate
        if (name.length > 0) {
            var data = {
                Name: name
            };
            ajaxHelper(listsUri, 'POST', data).done(function (val) {
                $("#listBox").append("<li><div class=\"box\"id='list_box' name=\"" + val.Id + "\">" + val.Name + "</div></li>");

            });
        } else {
            alertMessage("Input the LISTBOX NAME you want.");
        }
    }
    function getAllLists() {
         $.getJSON(listsUri, function (data) {
             $.each(data, function (key, val) {
                 $("#listBox").append("<li><div class=\"box\"id='list_box' name=\"" + val.Id + "\">" + val.Name + "</div></li>");
             });

        }).fail(
        function (jqXHR, textStatus, err) {
            alertMessage(err);
        });
    }
//get videos from a selected list
    $(document).delegate('#list_box', 'click', function () {
        //$('div #list_box').removeClass('box-selected');
        $('div #list_box').addClass('box');
        $(this).removeClass('box');
        $(this).addClass('box-selected');

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
                alertMessage(err);
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
        var v = $(this).parent().children();
        var id = $(this).attr('name');
        var index = v.eq(8).attr('content'); //vID
        
        var data;
        ajaxHelper(videoUri + id, 'DELETE', data).done(function () {
            alertMessage("COMPLETE DELETE the selected data");

            $("#videos li[name='"+index+"']").remove();
            vTotal--;

            index = v.eq(8).attr('content');
            var i = jQuery.inArray(index, o_playVideoListIds);
            o_playVideoListIds.splice(i, 1);
            o_videoNums.splice(i, 1);

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
    function alertMessage(text) {
        $('#text').text("Danger!\t" + text);
        $('#alert').show().delay(2000).fadeOut();

    }
    function closebtn() {
        $(this).css('display','none');
    }
    $('#AddList').click(function () {
        var $el = $(this).parent().next();
        //var isAdd = $(this).parent().next().hasClass('form-group');
        //isAdd? $('form-group').fadeIn() : 
        $('.Lists').fadeIn();
        var $elW = ~~($el.outerWidth()),
            $elH = ~~($el.outerHeight()),
            docWidth = $(document).width(),
            docHeight = $(document).height();

        if ($elH < docHeight || $elW < docWidth) {
            $el.css({
                marginTop: -$elH / 2,
                marginLeft: -$elW / 2
            })
        } else {
            $el.css({ top: 0, left: 0 });
        }
        $el.find('#OKBtn').click(function () {
            $('.Lists').fadeOut();
            return false;
        });
    });


    $(document).ready(function(){

        getAllLists();
      
    });
   