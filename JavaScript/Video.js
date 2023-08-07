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

//영상정보
let currentVideoInfo;
let targetTagList
let targetVideoId

//댓글 요소
let commnetInput = document.getElementById("comment-input");
let cancelBtn = document.getElementById("cancelComment");
let writeBtn = document.getElementById("writeComment");

//전체 비디오 리스트
let allVideoList = [];
//우측 비디오카드 리스트
let recommendedVideo = [];

//쿼리로 비디오 아이디를 받아와서 영상을 받을때
let url = `https://oreumi.appspot.com/video/getVideoInfo?video_id=${id}`


var video = document.querySelector("video");
var title = document.querySelector(".title");
var view_info = document.querySelector("#viewsAnduploaded");
var videoDesc = document.querySelector(".video-description");


var userAvatar = document.querySelector("#channelProfile");
var channelName = document.querySelector(".name");
var sub = document.querySelector(".subscribers");
var linkToChannel = document.querySelectorAll(".linkToChannel");

var filterByChannelBtn = document.querySelector("#filterByChannel");
var filterByAllBtn = document.querySelector("#filterByAll");

console.log(view_info);
console.log(video);
console.log(title);

var Cname = '';

var CURL = '';

fetch(url).then((response) => response.json())
    .then((data) => {
        currentVideoInfo = data;
        targetTagList = currentVideoInfo.video_tag;
        targetVideoId = currentVideoInfo.video_id;
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

        for (const link of linkToChannel) {
            link.href = `./Channel.html?channel_name=${data["video_channel"]}`
        }

        Cname = data["video_channel"]

        CURL = `https://oreumi.appspot.com/channel/getChannelInfo?video_channel=${Cname}`

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

//전체영상 설정
fetch("https://oreumi.appspot.com/video/getVideoList")
    .then((response) => response.json())
    .then((data) => {
        allVideoList = data;
        setVideoCards(allVideoList);
    });

async function setVideoCards(videoList) {
    recommendedVideo = await calculateVideoSimilarities(
        videoList,
        targetTagList
    );
    //비디오카드가 추가될 html 요소
    const videos = document.getElementById("videos");
    //자식 요소 초기화
    videos.replaceChildren();

    for (let i = 0; i < recommendedVideo.length; i++) {
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

        videoLink.href = `./Video.html?video_id=${recommendedVideo[i].video_id}`
        videoLink.className = "videoCard";
        thumbnail.className = "thumbnail";
        infoText.className = "infoText";
        title.className = "title";
        channelName.className = "channelName";
        viewsAndUploaded.className = "viewsAndUploaded";

        //비디오 정보 받아오기
        fetch(`https://oreumi.appspot.com/video/getVideoInfo?video_id=${recommendedVideo[i].video_id}`)
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


// function postComments(){
//     const comment = document.getElementsByClassName("comment");
//     const userName = document.createElement("p");  // 유저 이름
//     const writeTime = document.createElement("span");  // 작성 시간
//     const userImg = document.createElement("img");  //유저 사진
//     const userComment = document.createElement("p");  // 댓글 내용
// }

function commentInputOnfocus() {
    cancelBtn.classList.remove("display_none");
    writeBtn.classList.remove("display_none");
}

function commentInputOnkeyup(event) {
    if (event.key === 'Enter' && commnetInput.value != "") {
        writeComment();
    }
    else if (event.key === 'Backspace' && commnetInput.value == "") {
        writeBtn.disabled = true;
    }
    else {
        writeBtn.disabled = false;
    }
}

function cancelComment() {
    commnetInput.value = "";
    commnetInput.blur();
    cancelBtn.classList.add("display_none");
    writeBtn.classList.add("display_none");
}

function writeComment() {
    const commentCard = document.createElement('div');
    const profilePic = document.createElement('div');
    const profilePic_icon = document.createElement('img');
    const comment_nth = document.createElement('div');
    const commentAvatar_nth = document.createElement('div');
    const commentName = document.createElement('p');
    const commentHour = document.createElement('span');
    const commentText_nth = document.createElement('div');
    const comment_nth_txt = document.createElement('p');
    const commentBtns = document.createElement('div');
    const commentBtn_1 = document.createElement('div');
    const commentBtn_2 = document.createElement('div');
    const commentLike = document.createElement('button');
    const commentLike_icon = document.createElement('img');
    const likeCount = document.createElement('span');
    const commentSomedown = document.createElement('button');
    const commentSomedown_icon = document.createElement('img');
    const reply = document.createElement('button');

    const writerProfile = document.querySelector(".comment-avatar").querySelector(".icon");
    const commentSection = document.querySelector('.comment');
    const latestComment = commentSection.querySelector('.latest-comment');
    const countComment = document.querySelector('.count-comments');

    //comment 자식요소 설정
    commentCard.appendChild(profilePic);
    commentCard.appendChild(comment_nth);

    profilePic.appendChild(profilePic_icon);

    comment_nth.appendChild(commentAvatar_nth);
    comment_nth.appendChild(commentText_nth);

    commentAvatar_nth.appendChild(commentName);

    commentName.appendChild(commentHour);

    commentText_nth.appendChild(comment_nth_txt);
    commentText_nth.appendChild(commentBtns);

    commentBtns.appendChild(commentBtn_1);
    commentBtns.appendChild(commentBtn_2);

    commentBtn_1.appendChild(commentLike);
    commentBtn_1.appendChild(likeCount);

    commentLike.appendChild(commentLike_icon);

    commentBtn_2.appendChild(commentSomedown);
    commentBtn_2.appendChild(reply);

    commentSomedown.appendChild(commentSomedown_icon);

    //속성설정
    commentCard.classList.add("comment-card");
    commentCard.classList.add("latest-comment");

    profilePic.classList.add("profile-pic");

    profilePic_icon.src = writerProfile.src;
    profilePic_icon.classList.add("icon");

    comment_nth.classList.add("comment2");

    commentAvatar_nth.classList.add("comment-Avatar2");

    commentHour.classList.add("commen-hour");
    commentHour.innerText = " now";

    commentName.classList.add("comment-name");
    commentName.innerHTML = "SOS" + commentName.innerHTML;

    commentText_nth.classList.add("comment-text2");

    comment_nth_txt.classList.add("avatar2-txt");
    comment_nth_txt.innerText = commnetInput.value;

    commentBtns.classList.add("comment-btns");

    commentBtn_1.classList.add("comment-btn");

    commentLike.classList.add("comment-like");

    commentLike_icon.classList.add("comment-icon");
    commentLike_icon.src = "./media/icon/liked.svg"

    likeCount.classList.add("likecount");
    likeCount.innerText = "0";

    commentBtn_2.classList.add("comment-btn");

    commentSomedown.classList.add("comment-somedown");

    commentSomedown_icon.classList.add("comment-icon");
    commentSomedown_icon.src = "./media/icon/SomeDown.svg";

    reply.classList.add("reply");
    reply.innerText = "reply";

    //댓글삽입
    commentSection.insertBefore(commentCard, latestComment);
    latestComment.classList.remove("latest-comment");

    //댓글 입력란 초기화
    cancelComment();

    //댓글수 증가
    countComment.innerText = parseInt(countComment.innerText) + 1;
}

//유사도 측정 함수
async function getSimilarity(firstWord, secondWord) {
    const openApiURL = "http://aiopen.etri.re.kr:8000/WiseWWN/WordRel";
    const access_key = "c487154b-f9d3-4962-a154-914e5e99c56d";

    let requestJson = {
        argument: {
            first_word: firstWord,
            second_word: secondWord,
        },
    };

    let response = await fetch(openApiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: access_key,
        },
        body: JSON.stringify(requestJson),
    });
    let data = await response.json();
    return data.return_object["WWN WordRelInfo"].WordRelInfo.Distance;
}

async function calculateVideoSimilarities(videoList, targetTagList) {
    let filteredVideoList = [];

    for (let video of videoList) {
        let totalDistance = 0;
        let promises = [];

        for (let videoTag of video.video_tag) {
            for (let targetTag of targetTagList) {
                if (videoTag == targetTag) {
                    promises.push(0);
                } else {
                    promises.push(getSimilarity(videoTag, targetTag));
                }
            }
        }

        let distances = await Promise.all(promises);

        for (let distance of distances) {
            if (distance !== -1) {
                totalDistance += distance;
            }
        }

        if (totalDistance !== 0) {
            if (targetVideoId !== video.video_id) {
                filteredVideoList.push({ ...video, score: totalDistance });
            }
        }
    }

    filteredVideoList.sort((a, b) => a.score - b.score);

    filteredVideoList = filteredVideoList.map((video) => ({
        ...video,
        score: 0,
    }));
    console.log(filteredVideoList);
    return filteredVideoList;
}