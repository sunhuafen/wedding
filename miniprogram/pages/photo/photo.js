// pages/photo/photo.js

Page({

  data: {
    imgPath: 'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/',
    isSwitch: false
  },

  touchStart: function (e) {
    this.setData({ isSwitch: true })
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
      url: '../nav/nav',
    })
  },

  prevPage: function () {
    wx.switchTab({
      url: '../invite/invite',
    })
  },

  onShareAppMessage: function () {
    return {
      title: '转发',
      path: '/pages/photo/photo'
    }
  }

})