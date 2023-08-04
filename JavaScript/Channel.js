// url 정보 받아오기 query = channel_name
const URLSearch = new URLSearchParams(location.search);
const id = URLSearch.get('channel_name');

const searchInput = document.getElementById('channelSearch');

let allVideoList = [];




//날짜 계산
function caluateDate(date) {                                            // date -> 업로드 날짜를 넣을 예정
  let Upload = new Date(date)                                          // 받아온 변수 date 를 날짜 형식으로 변환
  let nowDate = Date.now();                                            // 현재 날자흫 받아오기
  let diffSec = nowDate - Upload;                                      // 현재 날짜 - 받아온 날짜 가 저장 (밀리초 단위로 저장)

  let calDate = '';                                                    // 계산 후 원하는 형식을 저장할 변수

  if (diffSec < 60 * 1000) {                                              // 만약 60초 이하라면
    calDate += '몇초전'                                                 // 뭉뚱그려 '몇초전'을 반환
  }
  else if (diffSec < (60 * 60 * 1000)) {                                 // 60분 이하라면
    calDate = `${parseInt(diffSec / (60 * 1000))}분 전`;                // 계산된 시간을 분 단위로 변환하여 반환
  }
  else if (diffSec < (24 * 60 * 60 * 1000)) {                             // 24시간 이하라면
    calDate = `${parseInt(diffSec / (60 * 60 * 1000))}시간 전`;          // 계산된 시간을 시간 단위로 변환하여 반환
  }
  else if (diffSec < (7 * 24 * 60 * 60 * 1000)) {                          // 7일 이하라면
    calDate = `${parseInt(diffSec / (24 * 60 * 60 * 1000))}일 전`;       // 계산된 시간을 일 단위로 변환하여 반환
  }
  else if (diffSec < (30 * 24 * 60 * 60 * 1000)) {                         // 30일 이하라면 (위에서 7일을 걸렀으니 7 < 날짜 < 30 )
    calDate = `${parseInt(diffSec / (7 * 24 * 60 * 60 * 1000))}주 전`;   // 계산된 시간을 주 단위로 변환하여 반환
  }
  else if (diffSec < (12 * 30 * 24 * 60 * 60 * 1000)) {                    // 12달 이하라면
    calDate = `${parseInt(diffSec / (30 * 24 * 60 * 60 * 1000))}달 전`;  // 계산된 시간을 개월 단위로 변환하여 반환
  }
  else {                                                                  // 나머지(12개월 이상)면
    calDate = `${parseInt(diffSec / (12 * 24 * 60 * 60 * 1000))}년 전`;  // 계산된 시간을 년 단위로 변환하여 반환
  }

  return calDate;                                                         // 결과적으로 계산된 날짜 반환
}


// 수를 변환하는 함수 (1000, 100만 단위 마다 K, M 을 붙여줌)
function calculateNum(data) {

  let calNum = ''                                                        // 최종적으로 반환할 변수

  if (1000000 > data && data >= 1000) {                                  // 100만 이하 1000 이상이면
    let thousand = Math.floor(data / 1000);                            // 1000으로 나눠서 1000 이상 단위를 thousand
    let hundred = Math.floor((data % 1000) / 100);                     // 나머지중 100자리수를 hundred에 넣기
    calNum = `${thousand}.${hundred} K`;                               // 결과는 천.백 K
  }
  else if (data >= 1000000) {                                            // 100만 이상이면
    let mil = Math.floor(data / 1000000);                              // 100만으로 나눠서 100만 이상 단위를 mil 
    let notmil = Math.floor((data % 1000000) / 100000);                // 나머지를 10만으로 나워서 10만 단위를 notmil에
    calNum = `${mil}.${notmil} M`;                                     // 결과는 백만.십만 M
  } else {                                                               // 그것도 아니면
    calNum = data;                                                     // 그냥 반환
  }

  return calNum;                                                          // 결과 반환
}



// 채널 정보 ( 배너 channel_banner, 프로필 channel_profile, 채널명 channel_name, 구독자 subscribers )
var Curl = `https://oreumi.appspot.com/channel/getChannelInfo?video_channel=${id}`
Curl = encodeURI(Curl)

// 동기적으로 fetch를 받아오기 위해 함수화
// await는 async 함수 안에서만 사용 가능
// 채널 정보를 받아오는 함수
async function getChannelInfos() {

  // 동기적으로 데이터 받아오기
  await fetch(Curl, {
    // POST방식의 API
    method: "POST",
  })
    .then((response) => response.json())                                // 오는 응답 json 형식으로 변환
    .then((data) => {                                                   // 오는 데이터를 이용

      // 구독자 수 세기
      var subscriber = ''                                             // 구독자 수를 저장할 함수

      subscriber = calculateNum(data["subscribers"]);                  // 구독자수를 변환하여 저장

      // 구독자 수 입력
      var sub = document.querySelector("#subscribers");
      sub.textContent = `${subscriber} Subscribers`;

      // 채널 이름 받아오기
      var name = document.querySelector("#channelName");
      name.textContent = data['channel_name'];

      // 채널 배너 바꾸기
      var banner = document.querySelector('#channelCover img');
      banner.src = data['channel_banner'];

      // 채널 프로필
      var profile = document.querySelector('#channelProfile img')
      profile.src = data['channel_profile'];
      profile.width = 80;                           // 채널 프로필 사진이 커서 크기 한정
    })
}



// 채널 비디오 정보 ( 비디오 이름 title, 조회수, 업로드 날짜, 비디오 아이디, )
Rurl = `https://oreumi.appspot.com/channel/getChannelVideo?video_channel=${id}`;


// 동기적으로 함수 작성
// 채널이 가진 모든 비디오 가져오기
async function getChannelVideos() {

  // POST 방식으로 가져 오기
  await fetch(Rurl, {
    method: 'POST'
  })
    .then((response) => response.json())                              // 응답을 json 형식으로 전환
    .then((data) => {

      allVideoList = data;                                            // 데이터로 들어온 비디오들을 allVideoList에 넣어주기

      // 추천영상( 패널 메인 영상 ) 보여주기
      var vid = document.querySelector("#semiVideo div video");       // 추천영상을 넣을 비디오 받아오기

      let views = data.map(function (v) {                               // map 함수를 이용하여 views에 (v = 모든 data[])
        return v['views'];                                            // 모든 data[]['views'] 를 넣는다.
      })

      var maxViews = Math.max.apply(null, views);                     // 모든 조회수중에 가장 큰값을 maxViews로 반환

      var idx = views.indexOf(maxViews, 0);                            // 가장 큰 조회수가 있는 인덱스를 찾기

      // 비디오 아이디를 이용해 영상과 썸네일 받아오기
      vid.src = `https://storage.googleapis.com/oreumi.appspot.com/video_${data[idx]['video_id']}.mp4`;
      vid.poster = `https://storage.googleapis.com/oreumi.appspot.com/img_${data[idx]['video_id']}.jpg`;

      document.querySelector('#semiVideoTitle').textContent = data[idx]['video_title'];           // title 넣는 칸에 title 넣기
      document.querySelector('#semiVideoDescription').textContent = data[idx]['video_detail'];    // 정보 넣는 칸에 정보 넣기

      let calDate = caluateDate(data[idx]['upload_date']);                                        // 추천영상 업로드 날짜 계산

      document.querySelector('#semiVideoViewsAndUploaded').textContent = calDate;                 // 계산된 날짜를 날짜칸에 넣기

      // playlist 만들기
      let playList = document.querySelector('.playList');                                         // 플레이리스트 만들기

      // 검색이 없으면 보여주기 위해 넣어주기
      playList.innerHTML = '<h1 style="font-size: 40px; font-weight: 700; text-align:center; width: 100%; align-self:center; display: none;" class="noneSearch">검색 결과가 없습니다.</h1>';


      // 모든 비디오들 전부 넣어주기 시작
      for (let i = 0; i < data.length; i++) {


        let calDate = caluateDate(data[i]['upload_date']);                                          // 영상 업로드 날짜 계산

        playList.innerHTML +=                                                                       // 넣기 시작 (형식에 맞춰)
          `<a class="videoCard" href= './Video.html?video_id=${data[i]['video_id']}'>
        <img width="200" class="thumbnail" src="https://storage.googleapis.com/oreumi.appspot.com/img_${data[i]['video_id']}.jpg">
        <div class="detail">
          <div class="infoText">
            <div class="title">${data[i]['video_title']}</div>
            <div class="channelName">${id}</div>
            <div class="viewsAndUploaded">${calculateNum(data[i]['views'])} Views, ${calDate}</div>
          </div>
        </div>
      </a>`;
      }


    })

}



//검색 기능
function search() {

  // 채널 검색창을 받아오는데 '소문자로'
  let searchText = searchInput.value.toLowerCase();
  // 검색된 비디오 리스트 넣어줄 배열
  let searchedList = [];

  // 모든 비디오에서 검색어에 맞는 녀석들 찾기
  for (let i = 0; i < allVideoList.length; i++) {
    if (allVideoList[i].video_channel.toLowerCase().includes(searchText)    // 채널명 검색
      || allVideoList[i].video_detail.toLowerCase().includes(searchText)  // 내용 검색
      || allVideoList[i].video_title.toLowerCase().includes(searchText)   // 제목 검색
      || allVideoList[i].video_tag.includes(searchText)                   // 태그 검색
    ) {
      searchedList.push(allVideoList[i]);                                 // 검색된 비디오 리스트에 추가  
    }
  }

  // HTML 플레이리스트 부분 받아오기
  let playList = document.querySelector('.playList')

  // 있는 비디오들 지워주고, 검색 실패를 위한 대비만 남겨두기
  playList.innerHTML = '<h1 style="font-size: 40px; font-weight: 700; text-align:center; width: 100%; align-self:center; display: none;" class="noneSearch">검색 결과가 없습니다.</h1>';

  // 검색 실패시 띄워줄 녀석 먼저 찾기
  let none = document.querySelector('.noneSearch')

  if (searchedList.length == 0) {                                               // 검색된 리스트가 없다면
    none.style.display = 'block'                                              // 검색 실패 띄워 주기

  } else {                                                                      // 검색된게 있다면  
    none.style.display = 'none'                                               // 검색실패를 지워주고
    for (let i = 0; i < searchedList.length; i++) {                             // 모든 검색리스트에 대해

      let calDate = caluateDate(searchedList[i]['upload_date'])                // 업로드 날짜 계산해주고

      playList.innerHTML +=                                                    // 집어 넣어주기
        `<div class="videoCard">
        <img width="200" class="thumbnail" src="https://storage.googleapis.com/oreumi.appspot.com/img_${searchedList[i]['video_id']}.jpg">
        <div class="detail">
          <div class="infoText">
            <div class="title">${searchedList[i]['video_title']}</div>
            <div class="channelName">${id}</div>
            <div class="viewsAndUploaded">${searchedList[i]['views']}Views, ${calDate}</div>
          </div>
        </div>
      </div>`;
    }
  }


}

//검색창 엔터 이벤트 리스너
function searchEnter(event) {
  if (event.key === 'Enter') {                                                   // 엔터를 치면
    search();                                                                  // 검색하기
  }
}


document.querySelector('#subscriptionBtn').addEventListener('click', () => {

  alert('구독하시겠습니까?');
});



getChannelVideos()
getChannelInfos()





// //   비디오 정보
// fetch("http://oreumi.appspot.com/video/getVideoInfo?video_id=123")
//   .then((response) => console.log("response:", response))
//   .catch((error) => console.log("error:", error));

// //   //   비디오 리스트
// fetch("http://oreumi.appspot.com/video/getVideoList")
//   .then((response) => console.log("response:", response))
//   .catch((error) => console.log("error:", error));



// //   비디오정보
//   video_name = 비디오 이름
//   channel_name = 채널이름
//   channel_view = 채널 뷰
