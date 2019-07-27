// pages/attendInfo/attendInfo.js
Page({

  data: {
    attendList: []
  },

  // 获取列表
  getAttendList: function() {
    let cloud = wx.cloud.database();
    let that = this;
    let batchTimes = 10;
    let attends = [];
    cloud.collection('attendList').get({
      success: res => {
        for (let j = 0; j < res.data.length; j++) {
          attends.push(res.data[j])
          that.setData({
            attendList: attends
          })
        }
      }
    })
    for (let i = 1; i < batchTimes; i++) {
      let MAX_LIMIT = 20 * i;
      cloud.collection('attendList').skip(MAX_LIMIT).limit(20).get({
        success: res => {
          if (res.data.length > 0) {
            for (let j = 0; j < res.data.length; j++) {
              attends.push(res.data[j])
              that.setData({
                attendList: attends
              })
            }
          }
        }
      })
    }


    // cloud.collection('attendList').where({}).get({
    //   success: res => {
    //     console.log(res);
    //     that.setData({
    //       attendList: res.data
    //     })
    //   },
    //   fail: err => {
    //     wx.showToast({ icon: 'none', title: '网络异常，请稍后再试' });
    //   }
    // })
  },

  onLoad: function () {
    // 请求list
    this.getAttendList();
  }
})