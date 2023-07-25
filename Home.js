const videoTag = document.getElementById('video');
const searchInput = document.getElementById('search');
//전체 비디오 객체 리스트
let videoList = [];

//전체 비디오 리스트 초기화 및 비디오카드 생성
fetch("http://oreumi.appspot.com/video/getVideoList")
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        videoList = data;
        setVideoCards();
    });

//비디오 카드 생성 함수
function setVideoCards() {
    for (let i = 0; i < videoList.length; i++) {
        //비디오카드가 추가될 html 태그
        const article = document.getElementById("videos");

        //비디오카드 생성을 위한 html 태그
        const videoCard = document.createElement("div");
        const thumbnail = document.createElement("img");
        const detail = document.createElement("div");
        const channelProfile = document.createElement("img");
        const infoText = document.createElement("div");
        const title = document.createElement("div");
        const channelName = document.createElement("div");
        const viewsAndUploaded = document.createElement("div");

        //각 태그들의 속성값 설정
        thumbnail.width = "300";
        channelProfile.src = "./User-Avatar.svg";

        infoText.appendChild(title);
        infoText.appendChild(channelName);
        infoText.appendChild(viewsAndUploaded);

        detail.appendChild(channelProfile);
        detail.appendChild(infoText);

        videoCard.appendChild(thumbnail);
        videoCard.appendChild(detail);

        article.appendChild(videoCard);

        videoCard.className = "videoCard";
        thumbnail.className = "thumbnail";
        detail.className = "detail";
        channelProfile.className = "channelProfile";
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
                channelName.innerText = data.video_channel;
                viewsAndUploaded.innerText = `${data.views}Views, ${daysAgo(data.upload_date)}`;
            });
    }
}

//검색 결과에 따른 비디오카드 업데이트 함수
function updateVideoCards(updatedList) {

}

//검색 함수
function search() {
    let searchText = searchInput.value;
    let searchedList = [];
    for (let i = 0; i < videoList.length; i++) {
        if (videoList[i].video_channel.includes(searchText)
            || videoList[i].video_detail.includes(searchText)
            || videoList[i].video_title.includes(searchText)
            || videoList[i].video_tag.includes(searchText)
        ) {
            searchedList.push(videoList[i]);
        }
    }
    updateVideoCards(searchedList);
}

//업로드 날짜 포맷 함수
function daysAgo(uploadedTime) {
    const uploaded = new Date(uploadedTime);
    const now = new Date();

    const timeToSecond = {
        YEAR: 31356000,
        MONTH: 2592000,
        WEEK: 604800,
        DAY: 86400,
        HOUR: 3600,
        MINUTE: 60,
    }

    const timeDiff = (now.getTime() - uploaded.getTime()) / 1000;
    if (timeDiff >= timeToSecond.YEAR) {
        return `${Math.floor(timeDiff / timeToSecond.YEAR)}년 전`
    }
    else if (timeDiff >= timeToSecond.MONTH) {
        return `${Math.floor(timeDiff / timeToSecond.MONTH)}달 전`
    }
    else if (timeDiff >= timeToSecond.WEEK) {
        return `${Math.floor(timeDiff / timeToSecond.WEEK)}주 전`
    }
    else if (timeDiff >= timeToSecond.DAY) {
        return `${Math.floor(timeDiff / timeToSecond.DAY)}일 전`
    }
    else if (timeDiff >= timeToSecond.HOUR) {
        return `${Math.floor(timeDiff / timeToSecond.HOUR)}시간 전`
    }
    else if (timeDiff >= timeToSecond.MINUTE) {
        return `${Math.floor(timeDiff / timeToSecond.MINUTE)}분 전`
    }
    else {
        return `${Math.floor(timeDiff)}초 전`
    }
}