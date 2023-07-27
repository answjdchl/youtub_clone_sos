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

let url = "http://oreumi.appspot.com/video/getVideoInfo?video_id=12"

// 동영상 플레이어는 iframe 이용

var iframe = document.querySelector("iframe")
var title = document.querySelector(".title")
var view_info = document.querySelector(".info-txt")

// 채널 이름 받아와서 채널 프로필 띄워 주기 위함
var Curl = ''
var Cname = ''

fetch(url).then((response) => response.json())
.then((data) => {

    // 동영상 소스 붙여 넣기
    iframe.src = data["video_link"]

    // 비디오 제목 넣기
    title.textContent = data["video_title"]

    // 조회수 붙이기 위한 내용
    let view = ''

    console.log(data["views"])


    // 뷰가 너무 길면 줄여 주기 1000 이후에는 1.0K 1000000 이후에는 1.0M
    if(100000 > data["views"] >= 1000){
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

    // 조회수 붙이기
    view_info.textContent = `${view} Views ${data["upload_date"]}`


    Cname = data["video_channel"]
});


// fetch(url)