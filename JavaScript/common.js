const navBar = document.getElementById("navBar");
const tagArea = document.getElementById("tagArea");
function menuOpen() {
    if (navBar.classList.contains("display_none")) {
        navBar.classList.remove("display_none");
        tagArea.style.width = "calc(100% - 15.5rem)";
    }
    else {
        navBar.classList.add("display_none");
        tagArea.style.width = "calc(100% - 0.5rem)";
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
