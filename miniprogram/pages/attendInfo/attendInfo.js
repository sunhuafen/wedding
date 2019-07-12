// pages/attendInfo/attendInfo.js
Page({

  data: {
    attendList: []
  },

  // 
  getAttendList: function() {
    let cloud = wx.cloud.database();
    let that = this;
    cloud.collection('attendList').where({}).get({
      success: res => {
        that.setData({
          attendList: res.data
        })
      },
      fail: err => {
        wx.showToast({ icon: 'none', title: '网络异常，请稍后再试' });
      }
    })
  },

  onLoad: function () {
    // 请求list
    this.getAttendList();
  }
})