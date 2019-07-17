// pages/invite/invite.js
Page({

  data: {
    photo: 'cloud://wedding-e018a3.7765-wedding-e018a3/wedding/photo/6.jpg',
    isSwitch: false,
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

})