// pages/greet/greet.js
Page({

  data: {
    greetList: [],
    greetNum: 0,
    openId: null,
    userInfo: null,
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
      url: '../message/message',
    })
  },

  prevPage: function () {
    wx.switchTab({
      url: '../nav/nav',
    })
  },

  // 送上祝福按钮
  sendGreet: function (e) {
    let that = this;
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          userInfo: res.userInfo
        })
        that.getOpenId()
      }
    })
  },

  // 获取openId
  getOpenId: function () {
    let that = this;
    wx.cloud.callFunction({
      name: 'user',
      data: {}
    }).then(res => {
      that.setData({
        openId: res.result.openid
      })
      that.getIsExist();
    })
  },
  
  // 判断是否已经送上祝福
  getIsExist: function () {
    let that = this;
    let cloud = wx.cloud.database();
    // 判断是否已经送上祝福
    cloud.collection('greetList').where({
      '_openid': that.data.openId
    }).get({
      success: res => {
        if (res.data.length === 0) {
          // 可以送祝福
          that.addList();
        } else { // 已送过祝福
          wx.showToast({ icon: 'none', title: '您已经送过祝福了，谢谢' })
        }
      },
      fail: err => {
        wx.showToast({ icon: 'none', title: '网络异常，请稍后再试' })
      }
    })
  },

  // 添加一项
  addList: function() {
    let that = this;
    let userInfo = that.data.userInfo;
    let cloud = wx.cloud.database();
    cloud.collection('greetList').add({
      data: {
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
      },
      success: function (res) {
        wx.showToast({ icon: 'none', title: '祝福已送上，谢谢~' })
        // 获取祝福列表
        that.getList();
      },
      fail: err => {
        wx.showToast({ icon: 'none', title: '网络异常，请稍后再试' });
      }
    })
  },

  // 获取祝福列表
  getList: function() {
    wx.showLoading();
    let that = this;
    let cloud = wx.cloud.database();
    let promises = [];
    let total = 0;
    cloud.collection('greetList').count().then( res => {
      total = res.total;
      let batchTimes = Math.ceil(total / 20);
      for (let i = 0; i < batchTimes; i++) {
        let promise;
        if(i==0) {
          promise = cloud.collection('greetList').get();
        }else{
          promise = cloud.collection('greetList').skip(i * 20).limit(20).get();
        }
        promises.push(promise)
      }
      Promise.all(promises).then( res => {
        wx.hideLoading();
        let greetLists = [];
        for(let j=0; j< res.length; j++) {
          for(let k=0; k< res[j].data.length; k++) {
            greetLists.push(res[j].data[k]);
          }
        }
        that.setData({
          greetList: greetLists.reverse(),
          greetNum: total
        })
      })
    });
  },

  onShow: function () {
    // 获取祝福列表
    this.getList();
  },

  onShareAppMessage: function () {
    return {
      title: '转发',
      path: '/pages/greet/greet'
    }
  }
});