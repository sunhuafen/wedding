// pages/message/message.js
Page({

  data: {
    mesList: [],
    isEdit: false,
    mesCont: '',
    userInfo: null,
    isMainPage: true,
    attendInfo: {
      nickName: '',
      name: '',
      phone: '',
      peopleNum: 0,
      remark: ''
    },
    isFirst: true
  },

  // 获取留言列表
  getMesList: function() {
    let cloud = wx.cloud.database();
    let that = this;
    cloud.collection('mesList').where({}).get({
      success: res => {
        that.setData({
          mesList: res.data
        })
      },
      fail: err => {
        wx.showToast({ icon: 'none', title: '网络异常，请稍后再试' });
      }
    })
  },

  // 添加评论
  addMes: function() {
    let utilJs = require('../../util.js');
    let that = this;
    let userInfo = that.data.userInfo;
    let cloud = wx.cloud.database();
    let time = utilJs.formatTime (new Date());
    cloud.collection('mesList').add({
      data: {
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        mesCont: this.data.mesCont,
        time: time
      },
      success: function (res) {
        wx.showToast({ icon: 'none', title: '留言发送成功，谢谢~' });

        // 获取祝福列表
        that.getMesList();
        that.setData({
          mesCont: '',
          isEdit: !that.data.isEdit
        })
      },
      fail: err => {
        wx.showToast({ icon: 'none', title: '网络异常，请稍后再试' });
      }
    })
  },

  // 打开
  openEdit: function (e) {
    const that = this
    if (e.target.errMsg === 'getUserInfo:ok') {
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            userInfo: res.userInfo,
            isEdit: !that.data.isEdit
          })
        }
      })
    }

    that.setData({
      // userInfo: res.userInfo,
      isEdit: !that.data.isEdit
    })
  },

  // 打开或者取消出席信息页面
  changePage: function(e) {
    if (e.target.dataset.type) { // 打开
      // 查询是否已经填过信息
      this.getOpenId();
    }
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
      that.setData({
        openId: res.result.openid
      })
      that.getIsExist();
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
        console.log(res);
        if (res.data.length != 0) { // 已经填写过
          let info = res.data[0].info;
          info.peopleNum = parseInt(info.peopleNum);
          that.setData({
            isFirst: false,
            attendInfo: info
          })
        } else {
          that.setData({
            isFirst: true,
            attendInfo: info
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
      isEdit: !this.data.isEdit
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
    if (info.name === '') {+
      wx.showToast({ icon: 'none', title: '请输入姓名~' });
    } else if (info.phone === '') {
      wx.showToast({ icon: 'none', title: '请输入电话~' });
    } else {
      let cloud = wx.cloud.database();
      let that = this;
      info.nickName = 'Zz';
      cloud.collection('attendList').add({
        data: {info},
        success: function (res) {
          wx.showToast({ icon: 'none', title: '保存成功，谢谢~' });
          // 获取祝福列表
          that.changePage();
        },
        fail: err => {
          wx.showToast({ icon: 'none', title: '网络异常，请稍后再试' });
        }
      })
    }
  },

  onLoad: function () {
    // 请求list
    this.getMesList();
  }
})