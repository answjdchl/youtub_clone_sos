// query에서 정보를 받아와서 비디오를 보기위한 방법 
const URLSearch = new URLSearchParams(location.search);
const id = URLSearch.get('video_id');

const monthToString = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sept",
    10: "Oct",
    11: "Nov",
    12: "Dec",
};

//우측 비디오카드 리스트
let recommendedVideo = [];

//쿼리로 비디오 아이디를 받아와서 영상을 받을때
let url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${id}`


var video = document.querySelector("video");
var title = document.querySelector(".title");
var view_info = document.querySelector("#viewsAnduploaded");
var videoDesc = document.querySelector(".video-description");


var userAvatar = document.querySelector("#channelProfile");
var channelName = document.querySelector(".name");
var sub = document.querySelector(".subscribers");

var filterByChannelBtn = document.querySelector("#filterByChannel");
var filterByAllBtn = document.querySelector("#filterByAll");

console.log(view_info);
console.log(video);
console.log(title);

var Cname = '';

var CURL = '';

fetch(url).then((response) => response.json())
    .then((data) => {
        video.src = data["video_link"];
        video.poster = data["image_link"];
        title.textContent = data["video_title"];
        let view = '';

        console.log(data["views"])

        if (1000000 >= data["views"] && data["views"] >= 1000) {
            thou = Math.floor(data["views"] / 1000);
            console.log(thou);
            hun = Math.floor((data["views"] % 1000) / 100);
            console.log(hun);
            view = `${thou}.${hun}K`;
        }
        else if (data["views"] >= 1000000) {
            mil = Math.floor(data["views"] / 1000000);
            console.log(mil);
            notmil = Math.floor((data["views"] % 1000000) / 100000);
            console.log(notmil);
            view = `${mil}.${notmil}M`;
        } else {
            view = data["views"];
        }



        view_info.textContent = `${view} Views . ${uploadDateformat(data["upload_date"])}`
        videoDesc.textContent = data["video_detail"]
        channelName.textContent = data["video_channel"]

        filterByChannelBtn.innerHTML = `From ${data["video_channel"]}`


        Cname = data["video_channel"]

        CURL = `http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${Cname}`

        CURL = encodeURI(CURL)

        console.log(CURL)

        fetch(CURL, {
            method: "POST",

        }).then((response) => response.json())
            .then((data) => {
                userAvatar.src = data["channel_profile"]
                console.log(data)
                var subsciber = ''

                if (1000000 > data["subscribers"] && data["subscribers"] >= 1000) {
                    thou = Math.floor(data["subscribers"] / 1000);
                    console.log(thou);
                    hun = Math.floor((data["subscribers"] % 1000) / 100);
                    console.log(hun);
                    subsciber = `${thou}.${hun}K`;
                }
                else if (data["subscribers"] >= 1000000) {
                    mil = Math.floor(data["subscribers"] / 1000000);
                    console.log(mil);
                    notmil = Math.floor((data["subscribers"] % 1000000) / 100000);
                    console.log(notmil);
                    subsciber = `${mil}.${notmil}M`;
                } else {
                    subsciber = data["subscribers"];
                }

                sub.textContent = `${subsciber} subscribers`
            })
    });

//추천영상 설정
fetch("http://oreumi.appspot.com/video/getVideoList")
    .then((response) => response.json())
    .then((data) => {
        getRandomVideos(data);
        setVideoCards(recommendedVideo);
    });

//비디오 순서 랜덤으로 정렬
function getRandomVideos(videoList) {
    for (var i = 0; i < videoList.length; i++) {
        if (videoList[i].video_id === id) {
            fruits.splice(i, 1);
        }
    }
    videoList.sort(function (a, b) {
        return 0.5 - Math.random();
    });

    recommendedVideo = videoList;
}

function setVideoCards(videoList) {
    //비디오카드가 추가될 html 요소
    const videos = document.getElementById("videos");
    //자식 요소 초기화
    videos.replaceChildren();

    for (let i = 0; i < videoList.length; i++) {
        //비디오카드 생성을 위한 html 요소
        const videoLink = document.createElement("a");
        const videoCard = document.createElement("div");
        const thumbnail = document.createElement("img");
        const infoText = document.createElement("div");
        const title = document.createElement("div");
        const channelName = document.createElement("a");
        const viewsAndUploaded = document.createElement("div");

        //각 태그들의 속성값 설정
        thumbnail.width = "200";

        infoText.appendChild(title);
        infoText.appendChild(channelName);
        infoText.appendChild(viewsAndUploaded);

        videoCard.appendChild(thumbnail);
        videoCard.appendChild(infoText);

        videoLink.appendChild(videoCard);

        videos.appendChild(videoLink);

        videoLink.href = `./Video.html?video_id=${videoList[i].video_id}`
        videoLink.className = "videoCard";
        thumbnail.className = "thumbnail";
        infoText.className = "infoText";
        title.className = "title";
        channelName.className = "channelName";
        viewsAndUploaded.className = "viewsAndUploaded";

        //비디오 정보 받아오기
        fetch(`http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoList[i].video_id}`)
            .then((response) => response.json())
            .then((data) => {
                thumbnail.src = data.image_link;
                title.innerText = data.video_title;
                viewsAndUploaded.innerText = `${data.views}Views, ${daysAgo(data.upload_date)}`;
                const dataVideoChannel = data.video_channel;
                channelName.innerText = dataVideoChannel;
                channelName.href = `./Channel.html?channel_name=${dataVideoChannel}`;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function uploadDateformat(dateString) {
    const uploaded = new Date(dateString);

    return `${monthToString[uploaded.getMonth()]} ${uploaded.getDate()}, ${uploaded.getFullYear()}`;
}

//비디오카드 탑 메뉴 버튼 이벤트리스너
function filterVideos(event) {
    if (event.target.id == "filterByAll") {
        setVideoCards(recommendedVideo);
        filterByAllBtn.className = "topbtn-selected";
        filterByChannelBtn.className = "topbtn";
    }
    else if (event.target.id == "filterByChannel") {
        var filteredVideos = [];
        for (const video of recommendedVideo) {
            if (video.video_channel === Cname) {
                filteredVideos.push(video);
            }
        }
        setVideoCards(filteredVideos);
        filterByAllBtn.className = "topbtn";
        filterByChannelBtn.className = "topbtn-selected";
    }
}

function menuOpenInner(isOpen) {
    //햄버거 메뉴 열고 닫음에 따른 개별 변화
}

function onResizeInner(isScrollable) {
    //전체창 리사이즈에 따른 개별 변화
}