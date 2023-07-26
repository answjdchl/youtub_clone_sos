// 채널 url
const Curl = "http://oreumi.appspot.com/channel/getChannelVideo?video_channel=123"


fetch(Curl, {
  method: "POST", 
  headers: { 
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "Test",
    body: "I am testing!",
    userId: 1,
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log("error:", error));

//   비디오 정보
fetch("http://oreumi.appspot.com/video/getVideoInfo?video_id=123")
  .then((response) => console.log("response:", response))
  .catch((error) => console.log("error:", error));

//   //   비디오 리스트
fetch("http://oreumi.appspot.com/video/getVideoList")
  .then((response) => console.log("response:", response))
  .catch((error) => console.log("error:", error));



// //   비디오정보
//   video_name = 비디오 이름
//   channel_name = 채널이름
//   channel_view = 채널 뷰
