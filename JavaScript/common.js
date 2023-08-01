const navBar = document.getElementById("navBar");
const main = document.getElementsByTagName("main")[0];
const header = document.getElementById("header");

//navBar가 열려있는지에 대한 변수
let isOpen = true;
//main의 스크롤 가능 여부
let isScrollable = true;

//공통적용사항
window.addEventListener(`resize`, onResize);

//navBar 열고 닫는 함수
function menuOpen() {
    if (isOpen) {
        navBar.classList.add("display_none");
        isOpen = false;
        //navBar 닫기에 따른 개별 변경사항
        menuOpenInner(isOpen);
    }
    else {
        navBar.classList.remove("display_none");
        isOpen = true;
        //navBar 열기에 따른 개별 변경사항
        menuOpenInner(isOpen);
    }
}

//resize 이벤트에 따라 스타일 변경하는 함수
function onResize() {
    const mainHeight = main.clientHeight;
    const mainScrollHeight = main.scrollHeight;
    if (mainHeight < mainScrollHeight) {
        isScrollable = true;
        header.style.width = `calc(100% - 0.5rem)`
        //개별 스타일 설정
        onResizeInner(isScrollable);
    }
    else {
        isScrollable = false;
        header.style.width = `100%`
        //개별 스타일 설정
        onResizeInner(isScrollable);
    }
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
