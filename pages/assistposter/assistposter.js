// pages/assistposter/assistposter.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userinfo: { headimgurl: '', nickname: '' },
    hasreceivenum: 0,
    hasreceivemoney: 0.00,
    activename: '',
    qr_code:'',
    userid: 0,
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    wx.getUserInfo({
      success: res => {
        console.log(res);
        that.setData({
          userinfo: { headimgurl: res.userInfo.avatarUrl, nickname: res.userInfo.nickName }
        })
      }, fail: res => {
        console.log(res);
      }
    });
    var token = wx.getStorageSync('token');
    var data = {
      token: token,
      userid: options.userid,
      'type': 2,
      id: options.id,
      activename: options.active_name,
      zg_id: options.zg_id
    };//token字符串转成对象
    console.log(data);
    data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
    wx.request({
      url: 'https://qmzg.boc7.net/v7_createQr',
      method: 'post',
      data: { data: data },//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0) {
          that.setData({
            loadingHidden: true,
            qr_code: value.data.url,
            hasreceivenum: options.hasreceivenum,
            hasreceivemoney: options.hasreceivemoney,
            activename: options.active_name
          });
        }
      },
      fail: function (res) {
        console.log('获取二维码失败');
      },
      complete: function (res) {
        var value2 = app.decrypt(res.data);
        console.log(value2);
        if (value2.code == 0) {
          wx.getImageInfo({
            src: value2.data.url,
            success: function (res2) {
              console.log(res2);
              var qr_img = res2.path;
              wx.getImageInfo({
                src: that.data.userinfo.headimgurl,
                success: function (res3) {
                  console.log(res3);
                  var is_headimg = res3.path;
                  wx.getImageInfo({
                    src: that.options.active_name == '王者荣耀' ? 'https://qmzgcdn.boc7.net/test/poster_kingglory2.jpg' : (that.options.active_name == '穿越火线' ? 'https://qmzgcdn.boc7.net/test/poster_crossfire2.jpg' : (that.options.active_name == '海盗来了' ? 'https://qmzgcdn.boc7.net/test/poster_pirate.jpg' : (that.options.active_name == '欢乐斗地主' ? 'https://qmzgcdn.boc7.net/test/poster_landlord.jpg' : ''))),
                    success: function (res4) {
                      console.log(res4);
                      var is_backimg = res4.path;
                      var ctx = wx.createCanvasContext('shareCanvas');
                      ctx.rect(0, 0, 375, 500);
                      if (options.active_name == '王者荣耀') {
                        ctx.setFillStyle('#3D275D');
                      }
                      if (options.active_name == '穿越火线') {
                        ctx.setFillStyle('#181106');
                      }
                      if (options.active_name == '海盗来了') {
                        ctx.setFillStyle('#3F898A');
                      }
                      if (options.active_name == '欢乐斗地主') {
                        ctx.setFillStyle('#261505');
                      }
                      ctx.fill();
                      ctx.drawImage(is_backimg, 0, 0, 375, 300);
                      ctx.setTextAlign('left');
                      ctx.setFillStyle('#FFC731');
                      ctx.font = "normal 14px MicrosoftYaHei";
                      ctx.fillText(that.data.userinfo.nickname, 100, 320);
                      ctx.setFillStyle('#ffffff');
                      ctx.fillText('向您推荐了一个助攻活动', 100, 350);
                      ctx.fillText('已获助攻' + options.hasreceivenum +'次', 40, 420);
                      ctx.fillText('已获助攻金额' + options.hasreceivemoney + '元', 40, 450);
                      ctx.font = "normal 11px MicrosoftYaHei";
                      ctx.setTextAlign('right');
                      ctx.fillText('长按扫码 参与助攻', 346, 470);
                      ctx.save();
                      ctx.beginPath();
                      ctx.arc(64, 328, 28, 0, 2 * Math.PI);
                      ctx.setFillStyle('#D3AC5D');
                      ctx.fill();
                      ctx.clip();
                      ctx.drawImage(is_headimg, 36, 300, 56, 56);
                      ctx.closePath();
                      ctx.restore();
                      ctx.save();
                      ctx.beginPath();
                      ctx.arc(300, 410, 45, 0, 2 * Math.PI);
                      ctx.setFillStyle('#ffffff');
                      ctx.fill();
                      ctx.clip();
                      ctx.drawImage(qr_img, 257, 366, 86, 86);
                      ctx.closePath();
                      ctx.restore();
                      ctx.draw();
                    }, fail: function (res4) {
                      console.log(res4);
                    }
                  })
                }, fail: function (res3) {
                  console.log(res3);
                }
              });
            }, fail: function (res2) {
              console.log(res2);
            }
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  saveimg: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      fileType: 'jpg',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res2) {
            wx.showToast({
              title: '二维码保存成功',
              icon: 'none',
              duration: 2000
            })
          },
          fail: function (res2) {
            console.log(res2);
          }
        })
      },
      fail: function (res) {
        console.log(res);
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