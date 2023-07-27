// src="http://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1&origin=http://example.com"

// "image_link": "https://storage.googleapis.com/oreumi.appspot.com/img_12.jpg",
// "upload_date": "2023/05/01",
// "video_channel": "나와 토끼들",
// "video_detail": "귀여운 동물 친구들의 재롱꾼 면모",
// "video_id": 12,
// "video_link": "https://storage.googleapis.com/oreumi.appspot.com/video_12.mp4",
// "video_tag": [
//   "토끼",
//   "놀이"
// ],
// "video_title": "재미있는 토끼 트릭과 놀이",
// "views": 361184


// query에서 정보를 받아와서 비디오를 보기위한 방법 
const URLSearch = new URLSearchParams(location.search);
const id = URLSearch.get('video_id')

console.log(id)


//쿼리로 비디오 아이디를 받아와서 영상을 받을때
let url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${id}`


//임시로 넣은 비디오
url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=12`

var iframe = document.querySelector("iframe")
var title = document.querySelector(".title")
var view_info = document.querySelector(".info-txt")
var videoDesc = document.querySelector(".video-desc")


var userAvatar = document.querySelector(".user-avatar")
var channelName = document.querySelector(".channel-name")
var sub = document.querySelector(".subscribers")

console.log(view_info)
console.log(iframe)
console.log(title)

var Cname = ''

var CURL = ''

fetch(url).then((response) => response.json())
.then((data) => {
    iframe.src = data["video_link"]
    title.textContent = data["video_title"]
    let view = ''

    console.log(data["views"])

    if(1000000 >= data["views"] >= 1000){
        thou =  Math.floor(data["views"] / 1000);
        console.log(thou);
        hun = Math.floor((data["views"]%1000) / 100);
        console.log(hun);
        view = `${thou}.${hun}K`;
    }
    else if(data["views"] >= 1000000){
        mil =  Math.floor(data["views"] / 1000000);
        console.log(mil);
        notmil = Math.floor((data["views"]%1000000) / 100000);
        console.log(notmil);
        view = `${mil}.${notmil}M`;
    }else{
        view = data["views"];
    }



    view_info.textContent = `${view} Views ${data["upload_date"]}`
    videoDesc.textContent = data["video_detail"]
    channelName.textContent = data["video_channel"]




    Cname = data["video_channel"]

    CURL = `http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${Cname}`

    CURL = encodeURI(CURL)

    console.log(CURL)

    fetch(CURL, {
        method: "POST",
        
      }).then((response) => response.json())
               .then((data) =>{
                    userAvatar.src = data["channel_profile"]
                    console.log(data)
                    var subsciber = ''


                    if(1000000> data["subscibers"] >= 1000){
                        thou =  Math.floor(data["subscibers"] / 1000);
                        console.log(thou);
                        hun = Math.floor((data["subscibers"]%1000) / 100);
                        console.log(hun);
                        subsciber = `${thou}.${hun}K`;
                    }
                    else if(data["subscibers"] >= 1000000){
                        mil =  Math.floor(data["subscibers"] / 1000000);
                        console.log(mil);
                        notmil = Math.floor((data["subscibers"]%1000000) / 100000);
                        console.log(notmil);
                        subsciber = `${mil}.${notmil}M`;
                    }else{
                        subsciber = data["subscibers"];
                    }

                    sub.textContent = `${subsciber} subscribers`
               })
});


