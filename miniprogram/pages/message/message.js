// pages/message/message.js
Page({

  data: {
    mesList: [],
    mesIsOpen: false,
    mesCont: '',
    userInfo: null,
    isMainPage: true,
    attendInfo: {
      nickName: '',
      name: '',
      phone: '',
      peopleNum: 1,
      remark: ''
    },
    isFirst: true,
    attendNumList: [
      { name: '自己出席', value: 1 },
      { name: '两人出席', value: 2 },
      { name: '三人出席', value: 3 },
      { name: '三人以上', value: 4 }
    ],
    isMainPeople: false,
    isDisabled: true,
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

  prevPage: function () {
    wx.switchTab({
      url: '../greet/greet',
    })
  },

  // 获取留言列表
  getMesList: function() {
    // const cloud = require('wx-server-sdk')
    // cloud.init()
    // const db = cloud.database()
    // exports.main = async (event, context) => {
    //   return await db.collection('mesList')
    //     .skip(10) // 跳过结果集中的前 10 条，从第 11 条开始返回
    //     .limit(10) // 限制返回数量为 10 条
    //     .get()
    // }
    let cloud = wx.cloud.database();
    let that = this;
    let batchTimes = 10;
    let megs = [];
    cloud.collection('mesList').orderBy('time', 'desc').get({
      success: res => {
        for (let j = 0; j < res.data.length; j++) {
          megs.push(res.data[j])
          that.setData({
            mesList: megs
          })
        }
      }
    })
    for (let i = 1; i < batchTimes; i++) {
      let MAX_LIMIT = 20 * i;
      cloud.collection('mesList').orderBy('time', 'desc').skip(MAX_LIMIT).limit(20).get({
        success: res => {
          if (res.data.length > 0) {
            for (let j = 0; j < res.data.length; j++) {
              megs.push(res.data[j])
              that.setData({
                mesList: megs
              })
            }
          }
        }
      })
    }
  },

  // 添加评论
  addMes: function() {
    let utilJs = require('../../util.js');
    let that = this;
    let cloud = wx.cloud.database();
    let time = utilJs.formatTime (new Date());
    let userInfo = that.data.userInfo;
    if (that.data.mesCont) {
      cloud.collection('mesList').add({
        data: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          mesCont: that.data.mesCont,
          time: time
        },
        success: function (res) {
          wx.showToast({ icon: 'none', title: '留言发送成功，谢谢~' });
          // 获取祝福列表
          that.getMesList();
          that.setData({
            mesCont: '',
            mesIsOpen: !that.data.mesIsOpen
          })
        },
        fail: err => {
          wx.showToast({ icon: 'none', title: '网络异常，请稍后再试' });
        }
      })
    }else {
      wx.showToast({ icon: 'none', title: '写点啥吧~~' });
    }
  },

  // 打开
  openEdit: function (e) {
    const that = this
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          userInfo: res.userInfo,
          mesIsOpen: !that.data.mesIsOpen
        })
      }
    })
  },

  // 切换显示的页面
  changePage: function(e) {
    this.setData({
      isMainPage: !this.data.isMainPage
    })
  },

  // 获取openId
  getOpenId: function () {
    let that = this;
    wx.cloud.callFunction({
      name: 'user',
      data: {}
    }).then(res => {
      let peopleOpenId = res.result.openid;
      let isMainPeople = false;
      if (peopleOpenId === 'oQKAQ5V2Q-RJ0FbYWBUVuLRHRu3g' || peopleOpenId === 'oQKAQ5Y8F8srm-vbD-CPd4fLerCQ') { // 主要管理员可以查看出席人信息
        isMainPeople = true;
      }
      that.setData({
        isMainPeople: isMainPeople,
        openId: peopleOpenId
      })
      that.getIsExist();
      that.changePage();
    })
    
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          userInfo: res.userInfo
        })
      }
    })
  },

  // 判断出席信息是否已经填写
  getIsExist: function () {
    let that = this;
    let cloud = wx.cloud.database();
    cloud.collection('attendList').where({
      '_openid': that.data.openId
    }).get({
      success: res => {
        if (res.data.length != 0) { // 已经填写过
          let info = res.data[0];
          that.setData({
            isFirst: false,
            isDisabled: true,
            attendInfo: info
          })
        } else {
          that.setData({
            isFirst: true,
            isDisabled: false,
          })
        }
      },
      fail: err => {
        wx.showToast({ icon: 'none', title: '网络异常，请稍后再试' })
      }
    })
  },

  // 取消编辑
  closeEdit: function() {
    this.setData({
      mesIsOpen: !this.data.mesIsOpen
    })
  },

  // 输入框绑定
  inputEdit: function (e) {
    this.setData({
      mesCont: e.detail.value
    })
  },

  // 出席信息提交
  attendSubmit: function (e) {
    let info = e.detail.value;
    let that = this;

    if (info.name === '') {
      wx.showToast({ icon: 'none', title: '请输入姓名~' });
    } else if (info.phone === '') {
      wx.showToast({ icon: 'none', title: '请输入电话~' });
    } else {
      let cloud = wx.cloud.database();
      console.log(that.data.userInfo)
      let attendId = that.data.attendInfo._id;
      info.nickName = that.data.userInfo.nickName;
      info.avatarUrl = that.data.userInfo.avatarUrl;

      if (that.data.isFirst) { // 新增
        cloud.collection('attendList').add({
          data: info,
          success: function (res) {
            wx.showToast({ icon: 'none', title: '保存成功，谢谢~' });
            that.changePage();
          },
          fail: err => {
            wx.showToast({ icon: 'none', title: '网络异常，请稍后再试' });
          }
        })
      } else { // 编辑
        cloud.collection('attendList').doc(attendId).update({
          data: info,
          success: function (res) {
            wx.showToast({ icon: 'none', title: '编辑成功，谢谢~' });
            that.changePage();
            that.isAttendEdit();
          },
          fail: err => {
            wx.showToast({ icon: 'none', title: '网络异常，请稍后再试' });
          }
        })
      }
    }
  },

  // 开启出席信息编辑
  isAttendEdit: function () {
    this.setData({
      isDisabled: !this.data.isDisabled
    })
  },

  // 关闭出席信息编辑
  closeAttendEdit: function() {
    this.isAttendEdit();
    this.getIsExist();
  },

  onShow: function () {
    // 请求list
    this.getMesList();
  },

  onShareAppMessage: function () {
    return {
      title: '转发',
      path: '/pages/message/message'
    }
  }
})