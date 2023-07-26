# HTML

## 공통
- 아이콘 : .icon
- 유저 아바타 : .userAvatar
- 상단 바 : #header
    - #header > 로고 : #logo
    - #header > 검색 input : #search
- 왼쪽 nav 바 : #navBar
    - #navBar > 메뉴 제목 : .menuTitle
    - #navBar >  카테고리명 : .menuCategory
- 비디오카드 : .videoCard
    - .videoCard > 썸네일 : .thumbnail
    - .videoCard > 영상정보 : .detail
        - .detail > 채널 프로필 아바타 : .channelProfile
        - .detail > 영상정보 전체 텍스트 : .infoText
            - .infoText > 영상 제목 : .title
            - .infoText > 채널명 : .channelName
            - .infoText > 조회수 및 업로드 시간 : .viewsAndUploaded

## Home Page
- main > 태그 필터링 버튼 영역 : #tagNav
    - #tagNav > 태그 버튼 : .tagBtn
    - #tagNav > 선택된 버튼 : .selected
- main > 영상 목록 영역 : #videos
    - #videos > 비디오카드 : 공통 변수 참조

## Channel Page
- main > 채널 정보 : #channelInfo
    - #channelInfo > 채널 커버 이미지 영역 : #channelCover
    - #channelInfo > 채널 프로필 영역 : #channelProfile
        - #channelProfile > 채널명 : #channelName
        - #channelProfile > 구독자 수 : #subscribers
    - #channelInfo > 채널 구독 버튼 : #subscriptionBtn
- main > 채널 내비게이션 버튼 영역 : #channelNav
    - #channelNav > 채널 내비게이션 버튼 : .channelNavBtn
    - #channelNav > 채널 내비게이션 선택 버튼 : .selected
    - #channelNav > 채널 내비게이션 HOME 버튼 : #HOME
    - #channelNav > 채널 내비게이션 VIDEOS 버튼 : #VIDEOS
    - #channelNav > 채널 내비게이션 PLAYLISTS 버튼 : #PLAYLISTS
    - #channelNav > 채널 내비게이션 COMMUNITY 버튼 : #COMMUNITY
    - #channelNav > 채널 내비게이션 CHANNELS 버튼 : #CHANNELS
    - #channelNav > 채널 내비게이션 ABOUT 버튼 : #ABOUT
- main > 채널 컨텐츠 영역 : #channelMain
    - #channelMain > 채널 메인 동영상 : #semiVideo
        - #semiVideo > 동영상 플레이어 : #semiVideoPlayer
        - #semiVideo > 동영상 제목 : #semiVideoTitle
        - #semiVideo > 조회수 및 업로드 시간 : #semiVideoViewsAndUploaded
        - #semiVideo > 동영상 설명 : #semiVideoDescription
    - #channelMain > 채널 플레이리스트 목록 : #playLists
        - #playLists > 플레이리스트 영역 : .playList
            - .playList > 비디오카드 : 공통 변수 참조

## Video Page