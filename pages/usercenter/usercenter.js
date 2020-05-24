// pages/usercenter/usercenter.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    masklayer: true,//遮罩层默认关闭
    user:{},//用户信息
    totalqcoin:0,//总q币
    needbattle:0,//试玩游戏获得的战力
    gamelist:[],//游戏列表
    hastoken:0,//是否授权
    event: 0,//弹框事件
    contactparams: '',
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (!token) {
      token = '';
    }
    var data = app.encrypt(JSON.stringify({ token: token }));//对象转成字符串加密后
    wx.request({
      url: 'https://qmzg.boc7.net/selfCenter',
      method: 'post',
      data: { data: data },//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0) {
          that.setData({
            user: token?value.data.user:{},
            totalqcoin: token ?value.data.qb:0,
            hastoken: token ?1:0,
            needbattle: value.data.game_integrate,
            gamelist: value.data.game,
            loadingHidden: true
          })
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
      }
    })
  },

  /**
   * 用户关闭弹框
   */
  closemask: function (e) {
    this.setData({
      masklayer: !this.data.masklayer
    })
  },

  /**
   * 点击进入游戏
   */
  clickgame: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    if (that.data.gamelist[index].type == 1) {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [that.data.gamelist[index].location_big_img] // 需要预览的图片http链接列表
      })
    } else {
      setTimeout(function () {
        var token = wx.getStorageSync('token');
        if (token) {
          var frontback = app.globaldata.gametime;
          var interval = 0;//记录玩游戏的时间
          var setinterval = setInterval(function () {
            frontback = app.globaldata.gametime;
            interval += 1;
            if (interval >= 20) {
              clearInterval(setinterval);
              var data = { token: token, game_id: that.data.gamelist[index].id };//token字符串转成对象
              data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
              wx.request({
                url: 'https://qmzg.boc7.net/gameAdd',
                method: 'post',
                data: { data: data },//字符串转成json对象
                success: function (res) {
                  var value = app.decrypt(res.data);
                  if (value.code == 0) {
                    var arr = that.data.gamelist;
                    for (var i = 0; i < arr.length; i++) {
                      if (i == index) {
                        arr[i].has_play = 1;
                      }
                    }
                    that.setData({
                      masklayer: !that.data.masklayer,
                      event: 1,
                      gamelist: arr
                    })
                  }
                },
                fail: function (res) {
                  console.log('添加积分失败');
                }
              });
            } else {
              if (frontback == 1) {
                clearInterval(setinterval);
                if (that.data.gamelist[index].has_play != 1) {
                  wx.showToast({
                    title: '需要停留20秒，才算试玩成功哦~',
                    icon: 'none',
                    duration: 2000
                  });
                }
              }
            }
          }, 1000);
        };
      }, 5000);
    }
  },

  /**
   * 跳转客服页面回复1
   */
  replyone: function (e) {
    if(e.currentTarget.dataset){
      this.setData({
        masklayer: !this.data.masklayer,
        event: 2,
        contactparams: e.currentTarget.dataset.params
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      user: {},//用户信息
      totalqcoin: 0,//总Q币
      gamelist: [],//游戏列表
      hastoken: 0,//是否授权
      contactparams: '',
      loadingHidden: false
    })
    this.onLoad();
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
  
  }
})