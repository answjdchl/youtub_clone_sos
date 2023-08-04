const videoTag = document.getElementById('video');
const searchInput = document.getElementById('searchInput');
const tagNav = document.getElementById('tagNav');
const tagNavForward = document.getElementById('tagNavScrollForward');
const tagNavBackward = document.getElementById('tagNavScrollBackward');
const tagArea = document.getElementById("tagArea");
//전체 비디오 객체 리스트
let allVideoList = [];
//현재 비디오 객체 리스트 (검색 기능 등으로 필터링 된 목록)
let currentVideoList = [];
//현재 비디오의 태그 리스트
let currentTags = [];



//전체 비디오 리스트 초기화 및 비디오카드 생성
fetch("https://oreumi.appspot.com/video/getVideoList")
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        allVideoList = data;
        currentVideoList = data;
        setVideoCards(currentVideoList);
        setTagNavigator(getTags(currentVideoList));
        onResize();
    });



//tagNav 직접 스크롤 시 이벤트 리스너
tagNav.addEventListener('scroll', tagNavResize);


//비디오 카드 생성 함수
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
        const detail = document.createElement("div");
        const channelProfileLink = document.createElement("a");
        const channelProfile = document.createElement("img");
        const infoText = document.createElement("div");
        const title = document.createElement("div");
        const channelName = document.createElement("a");
        const viewsAndUploaded = document.createElement("div");

        //각 태그들의 속성값 설정
        thumbnail.width = "300";

        infoText.appendChild(title);
        infoText.appendChild(channelName);
        infoText.appendChild(viewsAndUploaded);

        channelProfileLink.appendChild(channelProfile);

        detail.appendChild(channelProfileLink);
        detail.appendChild(infoText);

        videoCard.appendChild(thumbnail);
        videoCard.appendChild(detail);

        videoLink.appendChild(videoCard);

        videos.appendChild(videoLink);

        videoLink.href = `./Video.html?video_id=${videoList[i].video_id}`
        videoLink.className = "videoCard";
        thumbnail.className = "thumbnail";
        detail.className = "detail";
        channelProfile.className = "channelProfile userAvatar";
        infoText.className = "infoText";
        title.className = "title";
        channelName.className = "channelName";
        viewsAndUploaded.className = "viewsAndUploaded";

        //비디오 정보 받아오기
        fetch(`https://oreumi.appspot.com/video/getVideoInfo?video_id=${videoList[i].video_id}`)
            .then((response) => response.json())
            .then((data) => {
                thumbnail.src = data.image_link;
                title.innerText = data.video_title;
                viewsAndUploaded.innerText = `${data.views}Views, ${daysAgo(data.upload_date)}`;
                const dataVideoChannel = data.video_channel;
                channelName.innerText = dataVideoChannel;
                channelName.href = `./Channel.html?channel_name=${dataVideoChannel}`;
                channelProfileLink.href = `./Channel.html?channel_name=${dataVideoChannel}`;

                return fetch(`https://oreumi.appspot.com/channel/getChannelInfo?video_channel=${dataVideoChannel}`, { method: "POST" });
            })
            .then((response) => response.json())
            .then((data) => {
                channelProfile.src = data.channel_profile;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

//nav 태그 내부의 버튼 생성 함수
function setTagNavigator(tagList) {
    //버튼이 추가될 html 요소
    const tagNav = document.getElementById("tagNav");
    //자식 요소 초기화
    tagNav.replaceChildren();

    //전체보기 버튼 추가
    const tagButton = document.createElement("button");
    tagButton.innerText = "all";
    tagButton.id = "all";
    tagButton.className = "tagBtn selected";
    tagButton.addEventListener('click', onclickTagButton);
    tagNav.appendChild(tagButton);

    for (let i = 0; i < tagList.length; i++) {
        const tagButton = document.createElement("button");
        tagButton.innerText = tagList[i];
        tagButton.id = tagList[i];
        tagButton.className = "tagBtn";
        tagButton.addEventListener('click', onclickTagButton);
        tagNav.appendChild(tagButton);
    }
}

//검색 함수
function search() {
    let searchText = searchInput.value.toLowerCase();
    let searchedList = [];



    for (let i = 0; i < allVideoList.length; i++) {
        if (allVideoList[i].video_channel.toLowerCase().includes(searchText)
            || allVideoList[i].video_detail.toLowerCase().includes(searchText)
            || allVideoList[i].video_title.toLowerCase().includes(searchText)
            || allVideoList[i].video_tag.includes(searchText)
        ) {
            searchedList.push(allVideoList[i]);
        }
    }

    let none = document.querySelector('.noneSearch')

    if (searchedList.length == 0) {
        currentVideoList = searchedList;
        setVideoCards(searchedList);
        setTagNavigator(getTags(currentVideoList));

        none.style.display = 'block'
    } else {
        currentVideoList = searchedList;
        setVideoCards(searchedList);
        setTagNavigator(getTags(currentVideoList));

        none.style.display = 'none'
    }
}

//검색창 엔터 이벤트 리스너
function searchEnter(event) {
    if (event.key === 'Enter') {
        search();
    }
}


//현재 검색결과의 tag 배열 반환 함수
function getTags(videoList) {
    currentTags = [];
    for (let i = 0; i < videoList.length; i++) {
        for (let j = 0; j < videoList[i].video_tag.length; j++) {
            currentTags.push(videoList[i].video_tag[j]);
        }
    }
    const deleteDup = new Set(currentTags);
    currentTags = [...deleteDup];
    return currentTags;
}

//navigator 버튼 이벤트 함수
function onclickTagButton(event) {
    //이전에 선택된 버튼 비활성화 / 현재 버튼 활성화
    const before = document.querySelector('.tagBtn.selected');
    before.classList.remove('selected');
    event.target.className = "tagBtn selected";

    //선택된 버튼이 all 버튼이면 전체 비디오 표시
    if (event.target.id === "all") {
        setVideoCards(currentVideoList);
        return;
    }

    //태그를 포함한 비디오를 필터링
    let videoList = [];
    const tag = event.target.id;
    for (let i = 0; i < currentVideoList.length; i++) {
        if (currentVideoList[i].video_tag.includes(tag)) {
            videoList.push(currentVideoList[i]);
        }
    }
    setVideoCards(videoList);
}

//tagNav 앞으로가기 버튼
function onclickTagNavForward() {
    const tagNavWidth = tagNav.clientWidth;
    const tagNavScrollWidth = tagNav.scrollWidth;
    const tagNavCurrentScroll = tagNav.scrollLeft;

    if (tagNavCurrentScroll - tagNavWidth <= 0) {
        tagNav.scrollLeft = 0;
        tagNavForward.classList.add("display_none");
        tagNavBackward.classList.remove("display_none");
    }
    else {
        tagNavBackward.classList.remove("display_none");
        tagNav.scrollLeft = tagNavCurrentScroll - tagNavWidth;
    }
}

//tagNav 뒤로가기 버튼
function onclickTagNavBackward() {
    const tagNavWidth = tagNav.clientWidth;
    const tagNavScrollWidth = tagNav.scrollWidth;
    const tagNavCurrentScroll = tagNav.scrollLeft;

    if (tagNavCurrentScroll + tagNavWidth >= tagNavScrollWidth - tagNavWidth) {
        tagNav.scrollLeft = tagNavScrollWidth - tagNavWidth;
        tagNavBackward.classList.add("display_none");
        tagNavForward.classList.remove("display_none");
    }
    else {
        tagNavForward.classList.remove("display_none");
        tagNav.scrollLeft = tagNavCurrentScroll + tagNavWidth;
    }
}

//tagNav 사이즈 변경에 따른 버튼 컨트롤 함수
function tagNavResize() {
    const tagNavWidth = tagNav.clientWidth;
    const tagNavScrollWidth = tagNav.scrollWidth;
    const tagNavCurrentScroll = tagNav.scrollLeft;

    if (tagNavWidth < tagNavScrollWidth) {
        if (tagNavCurrentScroll < tagNavScrollWidth - tagNavWidth) {
            tagNavBackward.classList.remove("display_none");
        }
        else {
            tagNavBackward.classList.add("display_none");
        }

        if (tagNavCurrentScroll > 0) {
            tagNavForward.classList.remove("display_none");
        }
        else {
            tagNavForward.classList.add("display_none");
        }
    }
    else {
        tagNavForward.classList.add("display_none");
        tagNavBackward.classList.add("display_none");
    }
}

//navBar 열기/닫기에 따른 개별 변경사항
function menuOpenInner(isOpen) {
    if (isOpen) {
        if (isScrollable) {
            tagArea.style.width = `calc(100% - 15.5rem)`
        }
        else {
            tagArea.style.width = `calc(100% - 15rem)`
        }
    }
    else {
        if (isScrollable) {
            tagArea.style.width = `calc(100% - 0.5rem)`
        }
        else {
            tagArea.style.width = `100%`
        }
    }
}

//전체창 resize에 따른 개별 변경사항 
function onResizeInner(isScrollable) {
    if (isScrollable) {
        if (isOpen) {
            tagArea.style.width = `calc(100% - 15.5rem)`
        }
        else {
            tagArea.style.width = `calc(100% - 0.5rem)`
        }
    }
    else {
        if (isOpen) {
            tagArea.style.width = `calc(100% - 15rem)`
        }
        else {
            tagArea.style.width = `100%`
        }
    }

    tagNavResize();
}