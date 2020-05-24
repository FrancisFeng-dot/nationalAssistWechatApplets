// pages/lotterydetail/lotterydetail.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    masklayer: true,//遮罩层默认关闭
    eventtype:0,//弹框事件类型
    contactparams:'',//客服消息 赞助商提示
    lottery_eventtype:0,//抽奖中奖弹框,1是中奖后的弹框0是未中奖后的弹框
    turnbale_eventtype: 0,//转盘抽奖弹框
    submitswitch: 1,//随机赋值没有任何意义，为了在第一时间将提交按钮变为不可点击
    goodsdetail:{},
    whetherdrawprize:0,//开奖类型，2待开，1已开
    partinperson:0,//参与人数
    is_partin: 0,//是否参与活动
    teamwintip:true,//组队中奖提示
    hastoken:0,//是否登录
    //remaindraws:3,//剩余抽奖数
    partinportrait:[],//参与者画像
    whethertowin:0,//是否中奖
    winnerdetails:[],//中奖者信息
    partinnerdetails: [],//参与者信息
    userid: '',//加密过的用户id
    share_userid:'',//分享过来的加密用户id
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    lotteryid:'',//抽奖商品主键id
    prize_type:0,//1是每日抽奖2是随机抽奖
    //Frequent_clicks:0,//预防频繁点击
    loginCode:0,//登录logincode
    gamelist:[],//游戏数组
    circlegoods: [],//商品广告
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.id || options.lottery_id) {
      var that = this;
      var token = wx.getStorageSync('token');
      if (!token) {
        token = '';
      }
      var uid = '';
      if (options.userid) {
        var userdata = app.decrypt(options.userid);
        uid = userdata.uid;//token字符串转成对象
      }
      var data = { token: token, id: options.id ? options.id : options.lottery_id, uid: uid };//token字符串转成对象
      console.log(data);
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/prizeInfo',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          console.log(value);
          if (value.code == 0) {
            that.setData({
              loadingHidden: true,
              lotteryid: options.id ? options.id : options.lottery_id,
              share_userid: options.userid ? options.userid : '',
              goodsdetail: value.data.goods,
              whetherdrawprize: value.data.status,
              partinperson: value.data.total,
              partinportrait: value.data.headimgurl,
              gamelist: value.data.game,
              hastoken: token ? 1 : 0,
              userid: token ? value.data.uid : '',
              circlegoods: value.data.circle_goods
            });
            console.log(that.data);
            if (value.data.status == 2 && value.data.join && value.data.join.length > 0) {//如果是待开奖并且组团人员是多个
              var arr = [];
              for (var i = 0; i < 4; i++) {
                if (value.data.join[i]) {
                  arr.push(value.data.join[i]);
                } else {
                  arr.push({});
                }
              }
              that.setData({
                is_partin: token && value.data.is_join == 1 ? 1 : 0,
                partinnerdetails: arr
              });
            }//待开奖并且参与人数大于0
            if (value.data.status == 1) {
              that.setData({
                winnerdetails: value.data.star,
                whethertowin: token ? value.data.is_star : 0,
                masklayer: token && value.data.is_first == 1 ? !that.data.masklayer : true,
                eventtype: token && value.data.is_first == 1 ? 2 : 0,
                lottery_eventtype: token && value.data.is_first == 1 ? value.data.is_star : 0
              });
            }//已经结束判断是否中奖
          }else{
            //if (that.options && that.options.userid) {
            wx.login({
              success: function (login) {
                if (login.code) {
                  console.log('获取code', login.code);
                  that.setData({
                    loginCode: login.code
                  });
                } else {
                  console.log('登录失败！' + res.errMsg)
                }
              }
            });
            that.setData({
              loadingHidden: true,
              masklayer: !that.data.masklayer,
              eventtype: 8
            });
            // } else {
            //   wx.navigateTo({
            //     url: '/pages/login/login'
            //   })
            // }
          }
        },
        fail: function (res) {
          console.log('获取抽奖活动失败');
        }
      });
    }
  },

  /**
   * 用户授权
   */
  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.encryptedData) {
      app.requesttoken(that.data.loginCode, e.detail, '', that.data.lotteryid);
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
   * 用户关闭组队中奖提示框
   */
  closeteamtip: function (e) {
    this.setData({
      teamwintip: !this.data.teamwintip
    })
  },

  /**
   * 领取奖励弹框
   */
  submitredempt: function (e) {
    this.setData({
      masklayer: !this.data.masklayer,
      eventtype: 4,
      prize_type:1
    })
  },

  /**
   * 免费参与抽奖
   */
  freepartinlottery: function (e) {
    var token = wx.getStorageSync('token');
    var that = this;
    if (token) {
      var userdata = {};
      if (!that.options.userid) {
        var data = {
          token: token, 
          id: that.data.lotteryid,
          formid: e.detail.formId
        };//token字符串转成对象
      }else{
        userdata = app.decrypt(that.options.userid);
        var data = { 
          token: token, 
          id: that.data.lotteryid, 
          formid: e.detail.formId,
          uid: userdata.uid
        };//token字符串转成对象
      }
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/joinPrize',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          if (value.code==0) {
            that.setData({
              is_partin: 1,
              whetherdrawprize: 2
            })
            // if (userdata && userdata.uid) {
            //   var arr = [];
            //   for (var i = 0; i < 4; i++) {
            //     if (value.data[i]) {
            //       arr.push(value.data[i]);
            //     } else {
            //       arr.push({});
            //     }
            //   }
            //   that.setData({
            //     partinnerdetails: arr
            //   })
            // }else{
            wx.getUserInfo({
              success: res => {
                var arr = [{ uid: 1, headimgurl: res.userInfo.avatarUrl, nickname: res.userInfo.nickName }, {}, {}, {}];//这里的uid，只作为展示自己的头像昵称
                that.setData({
                  partinnerdetails: arr
                })
              }
            })
          }else if(value.code==434){
            that.setData({
              masklayer: !that.data.masklayer,
              eventtype: 9
            })
          } else {
            wx.showToast({
              title:value.msg,
              icon:'none',
              duration:2000
            });
          }
        }, fail: function (res) {
          console.log('获取用户id失败');
        }
      });
    }else{
      wx.login({
        success: function (login) {
          if (login.code) {
            console.log('获取code', login.code);
            that.setData({
              loginCode:login.code
            });
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
      that.setData({
        masklayer: !that.data.masklayer,
        eventtype: 8
      });
    }
  },

  /**
   * 事件弹出提示框集合
   */
  eventtipset: function (e) {
    if (e.currentTarget.dataset){
      if (e.currentTarget.dataset.eventtype == 4) {
        this.setData({
          eventtype: e.currentTarget.dataset.eventtype,
          prize_type: e.currentTarget.dataset.prizetype?e.currentTarget.dataset.prizetype:0
        })
      } else if (e.currentTarget.dataset.eventtype==6) {
        this.setData({
          masklayer: !this.data.masklayer,
          eventtype: e.currentTarget.dataset.eventtype,
          contactparams: e.currentTarget.dataset.params,
          prize_type: e.currentTarget.dataset.prizetype ? e.currentTarget.dataset.prizetype : 0
        })
      } else {
        this.setData({
          masklayer: !this.data.masklayer,
          eventtype: e.currentTarget.dataset.eventtype,
          prize_type: e.currentTarget.dataset.prizetype ? e.currentTarget.dataset.prizetype : 0
        })
      }
    }
  },

  // sanguo: function (e) {
  //   wx.setClipboardData({
  //     data: e.currentTarget.dataset.text,
  //     success: function (res) {
  //       wx.navigateToMiniProgram({
  //         appId: 'wxd5d38ed289985e2f',
  //         path: '?scene=chid:1031chid14,subchid:sg003',
  //         extraData: {},
  //         envVersion: 'release',
  //         success(res) {
  //           console.log('成功打开小程序1');
  //         }
  //       });
  //     }
  //   })
  // },

  /**
   * 跳转到红包抽奖
   */
  randomlottery: function (e) {
    var token = wx.getStorageSync('token');
    var that = this;
    if (token) {
      wx.navigateTo({
        url: '/pages/moneybag/moneybag'
      });
    } else {
      wx.login({
        success: function (login) {
          if (login.code) {
            console.log('获取code', login.code);
            that.setData({
              loginCode:login.code
            });
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
      that.setData({
        masklayer: !that.data.masklayer,
        eventtype: 8
      });
    }
  },

  /**
   * 兑换信息提交
   */
  submitinfo: function (e) {
    var that = this;
    that.setData({
      submitswitch: 2
    })//随机赋值没有任何意义，为了在第一时间将提交按钮变为不可点击
    setTimeout(function () {
      that.setData({
        submitswitch: 1
      })//随机赋值没有任何意义，为了在第一时间将提交按钮变为可点击
    }, 6000);
    if (e.detail.value.input3.length < 5 || !parseInt(e.detail.value.input3)) {
      wx.showToast({
        title: 'QQ信息格式不正确，请重新输入',
        icon: 'none',
        duration: 2000
      })
    } else {
      var token = wx.getStorageSync('token');
      var data = {};
      if (that.data.prize_type == 1) {
        data = {
          token: token,
          id: that.data.lotteryid,
          wx_number: e.detail.value.input1,
          wx_nickname: e.detail.value.input2,
          qq: e.detail.value.input3,
          formid: e.detail.formId
        };//token字符串转成对象
        data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
        wx.request({
          url: 'https://qmzg.boc7.net/dayPrizeExchange',
          method: 'post',
          data: { data: data },//字符串转成json对象
          success: function (res) {
            var value = app.decrypt(res.data);
            if (value.code == 0) {
              that.setData({
                masklayer: !that.data.masklayer
              })
            } else {
              wx.showToast({
                title: value.msg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function (res) {
            console.log('提交失败');
          }
        });
      } else {
        data = {
          token: token,
          wx_number: e.detail.value.input1,
          wx_nickname: e.detail.value.input2,
          qq: e.detail.value.input3,
          formid: e.detail.formId
        };//token字符串转成对象
        data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
        wx.request({
          url: 'https://qmzg.boc7.net/addLotteryInfo',
          method: 'post',
          data: { data: data },//字符串转成json对象
          success: function (res) {
            var value = app.decrypt(res.data);
            if (value.code == 0) {
              that.setData({
                masklayer: !that.data.masklayer
              })
            } else {
              wx.showToast({
                title: value.msg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function (res) {
            console.log('提交失败');
          }
        });
      }
    }
  },

  /**
   * 点击进入游戏
   */
  clickgame: function (e) {
    var that = this;
    if (that.data.gamelist[index].type == 1) {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [that.data.gamelist[index].location_big_img] // 需要预览的图片http链接列表
      })
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
    this.setData({
      masklayer: true,//遮罩层默认关闭
      eventtype: 0,//弹框事件类型
      contactparams: '',//客服消息 赞助商提示
      lottery_eventtype: 0,//抽奖中奖弹框,1是中奖后的弹框0是未中奖后的弹框
      turnbale_eventtype: 0,//转盘抽奖弹框
      submitswitch: 1,//随机赋值没有任何意义，为了在第一时间将提交按钮变为不可点击
      goodsdetail: {},
      whetherdrawprize: 0,//开奖类型，2待开，1已开
      partinperson: 0,//参与人数
      is_partin: 0,//是否参与活动
      teamwintip: true,//组队中奖提示
      hastoken: 0,//是否登录
      //remaindraws:3,//剩余抽奖数
      partinportrait: [],//参与者画像
      whethertowin: 0,//是否中奖
      winnerdetails: [],//中奖者信息
      partinnerdetails: [],//参与者信息
      userid: '',//加密过的用户id
      share_userid: '',//分享过来的加密用户id
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      lotteryid: '',//抽奖商品主键id
      prize_type: 0,//1是每日抽奖2是随机抽奖
      //Frequent_clicks:0,//预防频繁点击
      loginCode: 0,//登录logincode
      gamelist: [],//游戏数组
      circlegoods: [],//商品广告
      loadingHidden: false
    })
    this.onLoad(this.options);
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
    if (that.data.userid && that.data.lotteryid) {//抽奖邀请
      return {
        title: that.data.partinnerdetails[0].nickname + '邀请您参与『' + that.data.goodsdetail.goods_name + '』抽奖',
        path: 'pages/lotterydetail/lotterydetail?userid=' + that.data.userid + '&&id=' + that.data.lotteryid,
        desc: '',
        imageUrl: that.data.goodsdetail.big_img
      }
    } else if (that.data.partinnerdetails.length>0) {//未登录状态分享
      return {
        title: that.data.partinnerdetails[0].nickname + '邀请您参与『' + that.data.goodsdetail.goods_name +'』抽奖',
        path: 'pages/lotterydetail/lotterydetail?id=' + that.data.lotteryid,
        desc: '',
        imageUrl: that.data.goodsdetail.big_img
      }
    }
  }
})