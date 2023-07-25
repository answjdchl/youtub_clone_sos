const videoTag = document.getElementById('video');
const searchInput = document.getElementById('search');
let videoList = [];
let searchedList = [];

fetch("http://oreumi.appspot.com/video/getVideoList")
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        videoList = data;
        setVideoCards();
    });

function setVideoCards() {
    for (let i = 0; i < videoList.length; i++) {
        const article = document.getElementById("videos");

        const videoCard = document.createElement("div");
        const video = document.createElement("video");
        const detail = document.createElement("div");
        const channelProfile = document.createElement("img");
        const infoText = document.createElement("div");
        const title = document.createElement("div");
        const channelName = document.createElement("div");
        const viewsAndUploaded = document.createElement("div");

        video.width = "300";
        video.setAttribute("controls", true);
        channelProfile.src = "./User-Avatar.svg";

        infoText.appendChild(title);
        infoText.appendChild(channelName);
        infoText.appendChild(viewsAndUploaded);

        detail.appendChild(channelProfile);
        detail.appendChild(infoText);

        videoCard.appendChild(video);
        videoCard.appendChild(detail);

        article.appendChild(videoCard);

        videoCard.className = "videoCard";
        video.className = "video";
        detail.className = "detail";
        channelProfile.className = "channelProfile";
        infoText.className = "infoText";
        title.className = "title";
        channelName.className = "channelName";
        viewsAndUploaded.className = "viewsAndUploaded";

        fetch(`http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoList[i].video_id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                video.poster = data.image_link;
                video.src = data.video_link;
                title.innerText = data.video_title;
                channelName.innerText = data.video_channel;
                viewsAndUploaded.innerText = `${data.views}Views, ${daysAgo(data.upload_date)}`;
            });
    }
}

function search() {
    let searchText = searchInput.value;
    searchedList = [];
    for (let i = 0; i < videoList.length; i++) {
        if (videoList[i].video_channel.includes(searchText)
            || videoList[i].video_detail.includes(searchText)
            || videoList[i].video_title.includes(searchText)
            || videoList[i].video_tag.includes(searchText)
        ) {
            searchedList.push(videoList[i]);
        }
    }
    console.log(searchedList);
}

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