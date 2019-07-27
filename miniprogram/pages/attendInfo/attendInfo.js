// pages/attendInfo/attendInfo.js
Page({

  data: {
    attendList: []
  },

  // 获取列表
  getAttendList: function() {
    wx.showLoading();
    let that = this;
    let cloud = wx.cloud.database();
    let promises = [];
    let total = 0;
    cloud.collection('attendList').count().then(res => {
      total = res.total;
      let batchTimes = Math.ceil(total / 20);
      for (let i = 0; i < batchTimes; i++) {
        let promise;
        if (i == 0) {
          promise = cloud.collection('attendList').get();
        } else {
          promise = cloud.collection('attendList').skip(i * 20).limit(20).get();
        }
        promises.push(promise)
      }
      Promise.all(promises).then(res => {
        wx.hideLoading();
        let attendLists = [];
        for (let j = 0; j < res.length; j++) {
          for (let k = 0; k < res[j].data.length; k++) {
            attendLists.push(res[j].data[k]);
          }
        }
        that.setData({
          attendList: attendLists.reverse()
        })
      })
    });
  },

  onLoad: function () {
    // 请求list
    this.getAttendList();
  }
})