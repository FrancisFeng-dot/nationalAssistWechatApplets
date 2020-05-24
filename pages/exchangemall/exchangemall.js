//exchangemall.js
//获取应用实例
const app = getApp();
Page({
  data: {
    masklayer: true,//遮罩层默认关闭
    goodslist: [],//商品列表
    battle:0,//战力值
    insufficientbattle:1,//战力不足
    exchange:{goodsname:'',battlevalue:0,goodsid:0},//兑换物品的名称和战力值
    userid:'',//加密过的用户id
    freeexchange:'',//兑换点击的商品编号
    generateimage:'',//canvas生出的图片路径
    activebanner: [{ img: 'https://qmzgcdn.boc7.net/test/chuanqi_raiders.jpg', game_appid: 'wx79ade44c39cefc7f', game_url: '?chid=2020&amp;subchid=124' }, { img: 'https://qmzgcdn.boc7.net/test/xiyou_raiders.jpg', game_appid: 'wx78caa30cd32c16b9', game_url: '?channel=mengmob28'}]
  },

  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (!token) {
      token = '';
    }
    var data = { token: token };//token字符串转成对象
    data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
    wx.request({
      url: 'https://qmzg.boc7.net/shopGoods',
      method: 'post',
      data: { data: data },//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0) {
          that.setData({
            goodslist: value.data.shop_goods,
            battle: token?value.data.integrate:0,
            userid:token?value.data.uid:''
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
      },
      fail: function (res) {
        console.log('获取首页信息失败');
      }
    });
  },

  onShow: function () {

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
   * 用户点击兑换
   */
  redeemgoods: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      var index = e.currentTarget.dataset.index;
      if (that.data.battle >= that.data.goodslist[index].battle) {
        var data = { token: token, goods_id: that.data.goodslist[index].id };//token字符串转成对象
        data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
        if (that.data.goodslist[index].type == 1) {
          wx.request({
            url: 'https://qmzg.boc7.net/confirmExchange',
            method: 'post',
            data: { data: data },//字符串转成json对象
            success: function (res) {
              var value = app.decrypt(res.data);
              if (value.code == 0) {
                that.setData({
                  masklayer: !that.data.masklayer,
                  insufficientbattle: 0,
                  exchange: { goodsname: that.data.goodslist[index].goods_name, battlevalue: that.data.goodslist[index].battle, goodsid: that.data.goodslist[index].id },
                  battle: that.data.battle - that.data.goodslist[index].battle
                })
              }
              if (value.code == 450) {
                wx.showToast({
                  title: value.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail: function (res) {
              console.log('参数错误');
            }
          });
        } else if (that.data.goodslist[index].type == 5) {
          that.setData({
            masklayer: !that.data.masklayer,
            insufficientbattle: 2,
            freeexchange: index
          })
        }//红包兑换
      } else {
        wx.getImageInfo({
          src: 'https://qmzgcdn.boc7.net/test/goodskin2.jpg',
          success: function (res) {
            var backgroundimg = res.path;
            wx.getImageInfo({
              src: that.data.goodslist[index].big_img,
              success: function (res2) {
                var ctx = wx.createCanvasContext('shareCanvas');
                ctx.drawImage(backgroundimg, 0, 0, 187, 150);
                ctx.drawImage(res2.path, 8, 16, 72, 72);
                ctx.setTextAlign('left');
                ctx.setFillStyle('#333333');
                ctx.font = "bold 8px MicrosoftYaHei";
                ctx.fillText(that.data.goodslist[index].goods_name, 86, 36);
                ctx.setFillStyle('#FE4141');
                ctx.font = "normal 9px MicrosoftYaHei";
                ctx.fillText(that.data.goodslist[index].battle + '战力', 86, 64);
                ctx.setFillStyle('#999999');
                ctx.setFontSize(8);
                ctx.fillText('价值：' + that.data.goodslist[index].money + '元', 86, 82);
                ctx.stroke();
                ctx.draw();
              },
              fail: function (res) {
                console.log('获取失败');
              },
              complete: function (res3) {
                wx.canvasToTempFilePath({
                  canvasId: 'shareCanvas',
                  fileType: 'jpg',
                  success: function (res3) {
                    that.setData({
                      masklayer: !that.data.masklayer,
                      insufficientbattle: 1,
                      freeexchange: index,
                      generateimage: res3.tempFilePath
                    })
                  }
                })
              }
            })
          }
        })
      }
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },

  /**
   * 红包兑换的方法
   */
  confirm_money: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token && e.currentTarget.dataset) {
      var index = e.currentTarget.dataset.index;
      var data = { token: token, goods_id: that.data.goodslist[index].id };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/moneyExchange',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          if (value.code == 0) {
            that.setData({
              masklayer: !that.data.masklayer,
              battle: that.data.battle - that.data.goodslist[index].battle
            })
            wx.showToast({
              title: value.msg,
              icon: 'none',
              duration: 3000
            })
          } else if (value.code == 433) {
            that.setData({
              insufficientbattle: 3
            })
          } else {
            wx.showToast({
              title: value.msg,
              icon: 'none',
              duration: 3000
            })
          }
        },
        fail: function (res) {
          console.log('参数错误2');
        }
      });
    }
  },

  /**
   * 兑换信息提交
   */
  submitinfo: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      var data = {
        token: token,
        goods_id: that.data.exchange.goodsid,
        wx_number: e.detail.value.input1,
        wx_nickname: e.detail.value.input2,
        qq: e.detail.value.input3,
        formid: e.detail.formId
      };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/exchangeShopGoods',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          if (value.code == 0) {
            that.setData({
              masklayer: !that.data.masklayer,
              battle: that.data.battle - that.data.exchange.battlevalue
            })
          }
          wx.showToast({
            title: value.msg,
            icon: 'none',
            duration: 2000
          })
        },
        fail: function (res) {
          console.log('提交失败');
        }
      });
    }
  },
  
  /**
   * 监听用户刷新
   */
  onPullDownRefresh: function (res) {
    this.setData({
      goodslist: [],//商品列表
      battle:0,//战力值
      insufficientbattle: 1,//战力不足
      exchange: { goodsname: '', battlevalue: 0, goodsid: 0 },//兑换物品的名称和战力值
      userid: '',//加密过的用户id
      freeexchange: '',//兑换点击的商品编号
      generateimage: ''//canvas生出的图片路径
    })
    this.onLoad();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    },100);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this; 
    if (that.data.userid) {//已经加密
      if (res.target && res.target.dataset.freeindex+1) {
        var index = res.target.dataset.freeindex;
        return {
          title: '我在全民助攻换『' + that.data.goodslist[index].goods_name + '』，点一下一起换！',
          path: 'pages/index/index?userid=' + that.data.userid,
          desc: '',
          imageUrl: that.data.generateimage
        }
      }else{
        return {
          title: '点一下，我的Q币、点券、视频卡你都有份~',
          path: 'pages/index/index?userid=' + that.data.userid,
          desc: '',
          imageUrl: 'https://qmzgcdn.boc7.net/test/exchangeskin2.jpg'
        }
      }
    }else{
      return {
        title: '点一下，我的Q币、点券、视频卡你都有份~',
        path: 'pages/index/index',
        desc: '',
        imageUrl: 'https://qmzgcdn.boc7.net/test/exchangeskin2.jpg'
      }
    }
  }

})