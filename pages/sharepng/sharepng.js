// pages/sharepng/sharepng.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lotteryid: 0,//
    userid: 0,
    gift_name: '',
    gift_time: '',
    qr_code: '',
    loadingHidden: false
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if(options.id){
    //   this.setData({
    //     lotteryid: options.id,//
    //     userid: options.userid,//
    //     nickname: options.nickname,//
    //     headimg: options.headimg,//
    //     gift_img: options.gift_img,//
    //     gift_name: options.gift_name,
    //     gift_time: options.gift_time
    //   });
    // }
    var that = this;
    var token = wx.getStorageSync('token');
    var data = { token: token, userid: options.userid, id: options.id ,'type':1};//token字符串转成对象
    data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
    wx.request({
      url: 'https://qmzg.boc7.net/v6_createQr',
      method: 'post',
      data: { data: data },//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        if (value.code == 0) {
          that.setData({
            loadingHidden: true,
            qr_code: value.data.url,
            lotteryid: options.id,//
            userid: options.userid,//
            nickname: options.nickname,//
            headimg: options.headimg,//
            gift_img: options.gift_img,//
            gift_name: options.gift_name,
            gift_time: options.gift_time
          });
        }
      },
      fail: function (res) {
        console.log('获取二维码失败');
      },
      complete: function (res) {
        var value2 = app.decrypt(res.data);
        if (value2.code == 0) {
          wx.getImageInfo({
            src: value2.data.url,
            success: function (res2) {
              var qr_img = res2.path;
              wx.getImageInfo({
                src: options.headimg,
                success: function (res3) {
                  var is_headimg = res3.path;
                  wx.getImageInfo({
                    src: options.gift_img,
                    success: function (res4) {
                      var is_giftimg = res4.path;
                      var ctx = wx.createCanvasContext('shareCanvas');
                      ctx.rect(0, 0, 345, 470);
                      ctx.setFillStyle('#ffffff');
                      ctx.fill();
                      ctx.setTextAlign('center');
                      ctx.setFillStyle('#333333');
                      ctx.font = "normal 17px MicrosoftYaHei";
                      ctx.fillText(options.nickname, 173, 82);
                      ctx.font = "normal 18px MicrosoftYaHei";
                      ctx.fillText('邀请好友参与，中奖概率翻倍', 173, 108);
                      ctx.setFillStyle('#666666');
                      ctx.font = "normal 12px MicrosoftYaHei";
                      ctx.fillText('邀请好友概率最多增加6倍', 173, 135);
                      ctx.drawImage(is_giftimg, 98, 169, 150, 120);
                      ctx.setFillStyle('#333333');
                      ctx.font = "normal 14px MicrosoftYaHei";
                      ctx.fillText('奖品：' + options.gift_name, 173, 325);
                      ctx.setFillStyle('#666666');
                      ctx.font = "normal 12px MicrosoftYaHei";
                      ctx.fillText(options.gift_time + '开奖', 173, 348);
                      ctx.drawImage(qr_img, 129, 375, 85, 85);
                      ctx.save();
                      ctx.beginPath();
                      ctx.arc(173, 33, 28, 0, 2 * Math.PI);
                      ctx.setFillStyle('#ffffff');
                      ctx.fill();
                      ctx.clip();
                      ctx.drawImage(is_headimg, 145, 5, 56, 56);
                      ctx.closePath();
                      ctx.restore();
                      ctx.draw();
                    }
                  })
                }
              })
            }
          })
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