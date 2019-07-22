// pages/invite/invite.js
const audioCtx = wx.createInnerAudioContext();

Page({

  data: {
    photo: 'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/1.jpg',
    isSwitch: false,
    isPlay: true,
    info: null
  },

  getInfo: function() {
    let cloud = wx.cloud.database();
    let that = this;
    cloud.collection('inviteInfo').where({}).get({
      success: res => {
        that.setData({
          info: res.data[0]
        })
      },
      fail: err => {
        wx.showToast({ icon: 'none', title: '网络异常，请稍后再试' });
      }
    })
  },

  getMusicUrl: function() {
    this.setData({
      isPlay: true
    })
    let musicUrl = "cloud://wedding-e018a3.7765-wedding-e018a3/wedding/music/1.mp3";
    audioCtx.src = musicUrl;
    audioCtx.loop = true;
    audioCtx.autoplay = true;
    audioCtx.play();
  },
  
  audioPlay: function() {
    const that = this;
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
    this.getInfo();
    this.getMusicUrl();
  },

  onShareAppMessage: function () {
    return {
      title: '转发',
      path: '/pages/invite/invite'
    }
  }

})