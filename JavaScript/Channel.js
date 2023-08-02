// url 정보 받아오기 query = channel_name
const URLSearch = new URLSearchParams(location.search);
const id = URLSearch.get('channel_name');

console.log(id)
// 채널 정보 ( 배너, 프로필. 채널명, 구독자 )
var Curl = `http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${id}`
Curl = encodeURI(Curl)

console.log(Curl)

fetch(Curl, {
  method: "POST",
})
.then((response) => response.json())
.then((data) => {
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

    console.log(subsciber)
})





// 채널 비디오 정보 ( 비디오 이름 title, 조회수, 업로드 날짜, 비디오 아이디, )
// response url = http://oreumi.appspot.com/channel/getChannelVideo?video_channel=



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
