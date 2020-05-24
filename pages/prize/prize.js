// pages/prize/prize.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:0,
    maskFlag: true,
    num: 3,
    maskFlag: true,
    //urls: [{ url: 'https://qmzg.boc7.net/uploads/background/20180716/94164893547843f4462ba7ef16c775f5.png' }, { url: 'https://qmzg.boc7.net/uploads/background/20180716/94164893547843f4462ba7ef16c775f5.png' }, { url: 'https://qmzg.boc7.net/uploads/background/20180716/94164893547843f4462ba7ef16c775f5.png' }, { url: 'https://qmzg.boc7.net/uploads/background/20180716/94164893547843f4462ba7ef16c775f5.png' }, { url: 'https://qmzg.boc7.net/uploads/background/20180716/94164893547843f4462ba7ef16c775f5.png' }, { url: 'https://qmzg.boc7.net/uploads/background/20180716/94164893547843f4462ba7ef16c775f5.png' }, { url: 'https://qmzg.boc7.net/uploads/background/20180716/94164893547843f4462ba7ef16c775f5.png' }, { url: 'https://qmzg.boc7.net/uploads/background/20180716/94164893547843f4462ba7ef16c775f5.png' }, { url: 'https://qmzg.boc7.net/uploads/background/20180716/94164893547843f4462ba7ef16c775f5.png' },]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    var data = { token: token};//token字符串转成对象
    data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
    wx.request({
      url: 'https://qmzg.boc7.net/getLotteryCount',
      method: 'post',
      data: { data: data },//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0) {
          if (value.count < 4) {
            that.setData({
              num: 3 - parseInt(value.count)
            });
          }
        } else {
          try {
            wx.clearStorageSync();
            wx.redirectTo({
              url: '/pages/login/login'
            })
          } catch (e) {
            console.log('Do something when catch error');
          }
        }
      },
      fail: function (res) {
        console.log('获取抽奖次数失败');
      }
    });
  },

  show_license: function (e) {
    var that = this;
    if (parseInt(that.data.num) > 0) {
      var token = wx.getStorageSync('token');
      var data = { token: token };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/addLottery',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          console.log(value);
          if (value.code == 0) {
            that.setData({
              maskFlag: false,
              num: parseInt(that.data.num) - 1
            })
            var timestamp = new Date().getTime();
            var timestamp1 = parseInt(timestamp / 10000);
            var timestamp2 = timestamp % (timestamp1);
            var timestamp3 = timestamp2 % 3;
            that.setData({
              type: timestamp3
            })
          }
        },
        fail: function (res) {
          console.log('添加抽奖次数错误');
        }
      });
    } else {
      wx.showToast({
        title: '很抱歉！您今日的抽奖次数已经用完',
        icon: 'none',
        duration: 2000
      })
    }
  },

  hidden_mask: function (e) {
    var that = this;
    that.setData({
      maskFlag: true,
      driver: 1
    })
  },

  sanguo: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      　　　　success: function (res) {
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          //urls: ['https://qmzg.boc7.net/uploads/game/20180726/c8b02a1a8a7781eb4d8a9dc6c547fc20.jpg'] // 需要预览的图片http链接列表
        })
      　　　　}
    　　})
  },

  hero: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: ['https://qmzgcdn.boc7.net/test/game_yxyfk.jpg'] // 需要预览的图片http链接列表
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 100);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '全民助攻-幸运大抽奖',
      path: 'pages/login/login',
      desc: '',
      imageUrl: 'https://qmzgcdn.boc7.net/test/chuojiang.png'
    }
  }
})