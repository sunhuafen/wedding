// pages/invite/invite.js
const audioCtx = wx.createInnerAudioContext();

Page({

  data: {
    photo: 'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/1.jpg',
    isSwitch: false,
    isPlay: true
  },

  getMusicUrl() {
    this.setData({
      isPlay: true
    })
    // const that = this
    // const db = wx.cloud.database()
    // const music = db.collection('music')
    // music.get().then(res => {
    let musicUrl = "http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46"
      audioCtx.src = musicUrl
      audioCtx.loop = true
      audioCtx.autoplay = true
      audioCtx.play()
      // that.getList()
    // })
  },
  
  audioPlay: function() {
    const that = this
    if (that.data.isPlay) {
      audioCtx.pause();
      that.setData({ isPlay: false });
      wx.showToast({ icon: 'none', title: '您已暂停音乐播放~' });
    } else {
      audioCtx.play();
      that.setData({ isPlay: true });
      wx.showToast({ icon: 'none', title: '背景音乐已开启~' });
    }
  },

  touchStart: function (e) {
    this.setData({ isSwitch: true})
  },

  touchEnd: function (e) {
    let that = this;
    let timeOut = setTimeout(outEvent, 3000);
    function outEvent() {
      that.setData({ isSwitch: false })
    }
  },

  nextPage: function () {
    wx.switchTab({
      url: '../photo/photo',
    })
  },

  onShow() {
    this.getMusicUrl();
  },

})