// pages/nav/nav.js

Page({
  data: {
    latitude: 34.639580,
    longitude: 112.419937,
    markers: [{
      id: 0,
      latitude: 34.639580,
      longitude: 112.419937,
      name: '秀水百合酒店'
    }],
    manPhone: '17611485861',
    womenPhone: '18301310861',
    mapHei: 300,
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
      url: '../greet/greet',
    })
  },

  prevPage: function () {
    wx.switchTab({
      url: '../photo/photo',
    })
  },
  
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap');
  },

  makeTall: function(e) {
    console.log(e);
    let phone = e.target.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  toNav: function () {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      scale: 16,
      name: '洛阳市-秀水百合酒店百合厅'
    })
  }, 
  
  onShareAppMessage: function () {
    return {
      title: '转发',
      path: '/pages/nav/nav'
    }
  }

})