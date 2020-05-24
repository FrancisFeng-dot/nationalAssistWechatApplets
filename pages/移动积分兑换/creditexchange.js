// pages/creditexchange/creditexchange.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    masklayer: true,//遮罩层默认关闭
    totalQ: -1,
    hastoken:0,
    goods_detail: { goods_id:'',battle_value:'' ,mobile_points:'',money:''},
    beforesend:0,//发送验证码的状态
    fewsecond:60,//数秒
    prevent_freclick:0,//防止频繁点击
    phone:'',
    verify:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      that.setData({
        hastoken: 1
      })
    }
    if (options.goods_id) {
      that.setData({
        goods_detail: { goods_id: options.goods_id, battle_value: options.battle_value, mobile_points: options.mobile_points, money: options.money }
      })
    }
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
   * 兑换商品
   */
  exchange_goods: function (e) {
    var that = this;
    that.setData({
      prevent_freclick:1
    })
    setTimeout(function () {
      that.setData({
        prevent_freclick: 0
      })
    },5000)
    if (parseInt(that.data.totalQ) == -1) {
      wx.showToast({
        title: '请先查询移动积分余额再进行兑换',
        icon: 'none',
        duration: 3000,
      })
    } else if (parseInt(that.data.totalQ) < parseInt(that.data.goods_detail.mobile_points)) {
      wx.showToast({
        title: '移动积分不足',
        icon: 'none',
        duration: 2000,
      })
    }else{
      var token = wx.getStorageSync('token');
      if (token) {
        var data = { token: token, gid: that.data.goods_detail.goods_id, formid: e.detail.formId, phone: that.data.phone, verify: that.data.verify };//token字符串转成对象
        console.log(data);
        data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
        wx.request({
          url: 'https://qmzg.boc7.net/createOrder',
          method: 'post',
          data: { data: data },//字符串转成json对象
          success: function (res) {
            var value = app.decrypt(res.data);
            console.log(value);
            var url = decodeURI(unescape(value.data.url));
            console.log(url);
            if (value.code == 0) {
              wx.navigateTo({
                url: '/pages/creditexchange/exchangeurl?url=' + value.data.url
              })
            }
          },
          fail: function (res) {
            console.log('获取链接失败');
          }
        });
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
  },

  /**
   * 获取验证码
   */
  requestinquire: function (e) {
    var that = this;
    console.log(e);
    var token = wx.getStorageSync('token');
    if(token){
      if (e.detail.target.dataset && e.detail.target.dataset.type == 1) {
        that.setData({
          beforesend: 1
        });
        wx.showToast({
          title: '发送成功，稍有延迟，请耐心等待',
          icon: 'none',
          duration: 3000,
        });
        var data = { token: token, phone: e.detail.value.input1 };//token字符串转成对象
        data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
        wx.request({
          url: 'https://qmzg.boc7.net/sendSMS',
          method: 'post',
          data: { data: data },//字符串转成json对象
          success: function (res) {
            var value = app.decrypt(res.data);
            console.log(value);
            if(value.code==0){
              var countseconds = setInterval(function(){
                that.setData({
                  fewsecond: that.data.fewsecond - 1
                })
              },1000);
              setTimeout(function () {
                clearInterval(countseconds);
                that.setData({
                  beforesend: 2,
                  fewsecond: 60//数秒
                })
              },60000);
            }else{
              wx.showToast({
                title: value.msg,
                icon: 'none',
                duration: 3000,
              });
            }
          },
          fail: function (res) {
            console.log('获取验证码失败');
          }
        });
      } else if (e.detail.target.dataset && e.detail.target.dataset.type == 2) {
        wx.showToast({
          title: '提交信息成功，稍有延迟，请耐心等待',
          icon: 'none',
          duration: 5000,
        })
        var data = { token: token, phone: e.detail.value.input1, captcha: e.detail.value.input2, formid: e.detail.formId};//token字符串转成对象
        data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
        wx.request({
          url: 'https://qmzg.boc7.net/searchPhoneIntegrate',
          method: 'post',
          data: { data: data },//字符串转成json对象
          success: function (res) {
            var value = app.decrypt(res.data);
            console.log(value);
            console.log(e.detail);
            if (value.code == 0) {
              that.setData({
                totalQ: value.data.score,
                verify: value.data.verify,
                masklayer: !that.data.masklayer,
                phone: e.detail.value.input1
              })
            }else{
              wx.showToast({
                title: value.msg,
                icon: 'none',
                duration: 3000,
              })
            }
          },
          fail: function (res) {
            console.log('查询失败');
          }
        });
      }
    }
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
    return {
      title: '移动积分可以兑换战力啦，别浪费了赶紧兑换！',
      path: 'pages/makebattle/makebattle',
      desc: '',
      imageUrl: 'https://qmzgcdn.boc7.net/test/share_Redeem1.jpg'
    }
  }
})