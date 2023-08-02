// url 정보 받아오기 query = channel_name
const URLSearch = new URLSearchParams(location.search);
const id = URLSearch.get('channel_name');

const searchInput = document.getElementById('channelSearch');

let allVideoList = [];




//날짜 계산
function caluateDate(date){                                            // date -> 업로드 날짜를 넣을 예정
  let Upload = new Date(date)                                          // 받아온 변수 date 를 날짜 형식으로 변환
  let nowDate = Date.now();                                            // 현재 날자흫 받아오기
  let diffSec = nowDate - Upload;                                      // 현재 날짜 - 받아온 날짜 가 저장 (밀리초 단위로 저장)

  let calDate = ''                                                     // 계산 후 원하는 형식을 저장할 변수

  if(diffSec < 60 * 1000){                                              // 만약 60초 이하라면
    calDate += '몇초전'                                                 // 뭉뚱그려 '몇초전'을 반환
  }
  else if(diffSec < (60 * 60 * 1000 )){                                 // 60분 이하라면
    calDate = `${parseInt(diffSec / (60 * 1000))}분 전`                 // 계산된 시간을 분 단위로 변환하여 반환
  }
  else if(diffSec < (24 * 60 * 60 * 1000)){                             // 24시간 이하라면
    calDate = `${parseInt(diffSec / (60 * 60 * 1000))}시간 전`           // 계산된 시간을 시간 단위로 변환하여 반환
  }
  else if(diffSec < (7 * 24 * 60 * 60 * 1000)){                          // 7일 이하라면
    calDate = `${parseInt(diffSec / (24 * 60 * 60 * 1000))}일 전`        // 계산된 시간을 일 단위로 변환하여 반환
  }
  else if(diffSec < (30 * 24 * 60 * 60 * 1000)){                         // 30일 이하라면 (위에서 7일을 걸렀으니 7 < 날짜 < 30 )
    calDate = `${parseInt(diffSec / (7 * 24 * 60 * 60 * 1000))}주 전`    // 계산된 시간을 주 단위로 변환하여 반환
  }
  else if(diffSec < (12 * 30 * 24 * 60 * 60 * 1000)){                    // 12달 이하라면
    calDate = `${parseInt(diffSec / (30 * 24 * 60 * 60 * 1000))}달 전`   // 계산된 시간을 개월 단위로 변환하여 반환
  }
  else{                                                                  // 나머지(12개월 이상)면
    calDate = `${parseInt(diffSec / (12 * 24 * 60 * 60 * 1000))}년 전`   // 계산된 시간을 년 단위로 변환하여 반환
  }

  return calDate                                                         // 결과적으로 계산된 날짜 반환
}


function calculateNum(data){

  let calNum = 0

  if (1000000 > data && data >= 1000) {
      let thou = Math.floor(data / 1000);
      console.log(thou);
      let hun = Math.floor((data % 1000) / 100);
      console.log(hun);
      calNum = `${thou}.${hun}K`;
  }
  else if (data >= 1000000) {
      let mil = Math.floor(data / 1000000);
      console.log(mil);
      let notmil = Math.floor((data % 1000000) / 100000);
      console.log(notmil);
      calNum = `${mil}.${notmil}M`;
  } else {
      calNum = data;
  }

  return calNum
}



// 채널 정보 ( 배너 channel_banner, 프로필 channel_profile, 채널명 channel_name, 구독자 subscribers )
var Curl = `http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${id}`
Curl = encodeURI(Curl)

// 동기적으로 fetch를 받아오기 위해 함수화
// await는 async 함수 안에서만 사용 가능
// 채널 정보를 받아오는 함수
async function getChannelInfos(){

  // 동기적으로 데이터 받아오기
  await fetch(Curl, {
    // POST방식의 API
    method: "POST",
  })
  .then((response) => response.json()) // 오는 응답 json 형식으로 변환
  .then((data) => {                    // 오는 데이터를 이용

      // 구독자 수 세기 시작
      var subscriber = ''               // 구독자 수를 저장할 함수

      subscriber = calculateNum(data["subscribers"])

      var sub = document.querySelector("#subscribers");
      sub.textContent = `${subscriber} Subscribers`;
      
      // 채널 이름 받아오기
      var name = document.querySelector("#channelName");
      name.textContent = data['channel_name'];

      // 채널 배너 바꾸기
      var banner = document.querySelector('#channelCover img');
      banner.src = data['channel_banner']

      // 채널 프로필
      var profile = document.querySelector('#channelProfile img')
      profile.src = data['channel_profile']
      profile.width = 80

  })
}



// 채널 비디오 정보 ( 비디오 이름 title, 조회수, 업로드 날짜, 비디오 아이디, )
Rurl = `http://oreumi.appspot.com/channel/getChannelVideo?video_channel=${id}`

async function getChannelVideos(){
  await fetch(Rurl, {
    method: 'POST'
  })
  .then((response) => response.json())
  .then((data) =>{

    allVideoList = data;

    let views = data.map(function(v){
      return v['views'];
    })

    var maxViews = Math.max.apply(null, views)

    var idx = views.indexOf(maxViews,0)

    var vid = document.querySelector("#semiVideo div video")

    vid.src = `https://storage.googleapis.com/oreumi.appspot.com/video_${data[idx]['video_id']}.mp4`
    vid.poster = `https://storage.googleapis.com/oreumi.appspot.com/img_${data[idx]['video_id']}.jpg`
    
    document.querySelector('#semiVideoTitle').textContent = data[idx]['video_title']
    document.querySelector('#semiVideoDescription').textContent = data[idx]['video_detail']

    let calDate = caluateDate(data[idx]['upload_date'])

    document.querySelector('#semiVideoViewsAndUploaded').textContent = calDate

    // playlist

    let playList = document.querySelector('.playList')

    playList.innerHTML = '<h1 style="font-size: 40px; font-weight: 700; text-align:center; width: 100%; align-self:center; display: none;" class="noneSearch">검색 결과가 없습니다.</h1>';
    
    for(let i = 0; i < data.length; i++){
      
      let calDate = caluateDate(data[i]['upload_date'])

      playList.innerHTML += 
      `<div class="videoCard">
        <img width="200" class="thumbnail" src="https://storage.googleapis.com/oreumi.appspot.com/img_${data[i]['video_id']}.jpg">
        <div class="detail">
          <div class="infoText">
            <div class="title">${data[i]['video_title']}</div>
            <div class="channelName">${id}</div>
            <div class="viewsAndUploaded">${calculateNum(data[i]['views'])} Views, ${calDate}</div>
          </div>
        </div>
      </div>`;
    }

    
  })

}



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


  let playList = document.querySelector('.playList')
  
  playList.innerHTML = '<h1 style="font-size: 40px; font-weight: 700; text-align:center; width: 100%; align-self:center; display: none;" class="noneSearch">검색 결과가 없습니다.</h1>';

  console.log(searchedList)

  let none = document.querySelector('.noneSearch')

  if(searchedList.length == 0){
    none.style.display = 'block'
  }else{
    
    none.style.display = 'none'
    for(let i = 0; i < searchedList.length; i++){
      
      let calDate = caluateDate(searchedList[i]['upload_date'])

      playList.innerHTML += 
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
  if (event.key === 'Enter') {
      search();
  }
}



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
