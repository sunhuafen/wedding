// pages/photo/photo.js

Page({

  data: {
    imgSrc: [
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/7.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/8.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/9.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/6.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/10.png'
    ],
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

})