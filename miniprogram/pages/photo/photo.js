// pages/photo/photo.js

Page({

  data: {
    imgSrc: [
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/2.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/3.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/4.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/5.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/6.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/7.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/8.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/9.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/10.png',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/11.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/12.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/13.jpg',
      'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/14.jpg'
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

  onShareAppMessage: function () {
    return {
      title: '转发',
      path: '/pages/photo/photo'
    }
  }

})