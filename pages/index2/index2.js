//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    activebanner: [],
    //battle: 0,//战力值
    //totalreceive:0,//今日领取红包人数
    userid: '',//加密过的用户id
    speaknotify:[],
    loadingHidden: false,
    masklayer: true,//遮罩层默认关闭红包弹框
    contactlayer: true,//客服弹框
    //layertype: 2,//遮罩层内容类型，默认无，1红包弹框，2为解锁红包弹框
    //opentype: 4,
    // redbagtype1: 1,//1是带解锁，2是已解锁，3是已打开
    // redbagtype2: 1,
    // redbagtype3: 1,
    // redbagtype4: 1,
    //envelopestatus:1,//首页红包状态
    //moneyarr: { 'key1': 0, 'key2': 0, 'key3': 0, 'key4': 0},//四个解锁红包的领取金额
    //distinguishuser:1,//1为老用户，3为新用户，老用户进入分享点开红包，或者新用户点开分享红包
    //envelopereward:0,//开启红包的金额
    //nickname:'',
    //headimg:'',
    hastoken:0,//用户是否登录
    contactparams: '',//访问客服界面的参数
    lotteryactive:[],//抽奖活动的详情
    gamelist1:[],//游戏栏目1
    gamelist2: [],//游戏栏目2
    countseconds:'',//计时装置
    squareballparams: { code: '', ranking: '', prizename: '', squareball:0,gamename:''},//全民方块球的相关参数
    giftorbattle:0
  },

  // onLoad: function (options) {
  //   console.log(options);
  //   var that = this;
  //   that.setData({
  //     loadingHidden: true
  //   });
  //   var token = wx.getStorageSync('token');
  //   if (token) {
  //     that.setData({
  //       hastoken: 1
  //     })
  //     // if (options && options.envelopetype>0){
  //     //   var userdata = {uid:''};
  //     //   if (options.userid) {
  //     //     userdata = app.decrypt(options.userid);
  //     //     console.log(userdata);
  //     //   }
  //     //   var redbag = { token: token, 'type': 2, uid: userdata.uid };//token字符串转成对象
  //     //   console.log(redbag);
  //     //   redbag = app.encrypt(JSON.stringify(redbag));//对象转成字符串加密后
  //     //   wx.request({
  //     //     url: 'https://qmzg.boc7.net/moneyStatus',
  //     //     method: 'post',
  //     //     data: { data: redbag },//字符串转成json对象
  //     //     success: function (res) {
  //     //       var value = app.decrypt(res.data);
  //     //       console.log(value);//判断是否能够领取新人红包
  //     //       if(value.code==0){
  //     //         if (value.status == 0) {
  //     //           that.setData({
  //     //             masklayer: !that.data.masklayer,
  //     //             layertype:1,
  //     //             opentype:4,
  //     //             envelopereward: value.money
  //     //           });
  //     //         }else{
  //     //           that.setData({
  //     //             masklayer: !that.data.masklayer,
  //     //             layertype: 1,
  //     //             opentype: 2,
  //     //             distinguishuser: 3//抽奖的新老用户
  //     //           });
  //     //           if (value.user) {
  //     //             that.setData({
  //     //               nickname: value.user.nickname,
  //     //               headimg: value.user.headimgurl
  //     //             });
  //     //           }
  //     //         }
  //     //       }
  //     //       if(value.code==443){
  //     //         if (value.status == 0) {
  //     //           that.setData({
  //     //             masklayer: !that.data.masklayer,
  //     //             layertype: 1,
  //     //             opentype: 4,
  //     //             envelopereward: value.money
  //     //           });
  //     //         } else {
  //     //           that.setData({
  //     //             masklayer: !that.data.masklayer,
  //     //             layertype: 1,
  //     //             opentype: 2,
  //     //             distinguishuser: 1//抽奖的新老用户
  //     //           });
  //     //           if (value.user) {
  //     //             that.setData({
  //     //               nickname: value.user.nickname,
  //     //               headimg: value.user.headimgurl
  //     //             });
  //     //           }
  //     //         }
  //     //       }
  //     //     }, fail: function (res) {
  //     //       console.log('获取用户领红包状态失败');
  //     //     }
  //     //   });//如果从分享界面进入，判断该用户是否为新用户，如果是，返回是否有抽过奖，如果不是同样判断是否有抽过奖
  //     // }
  //     // var redbag2 = { token: token,'type':3};//token字符串转成对象
  //     // redbag2 = app.encrypt(JSON.stringify(redbag2));//对象转成字符串加密后
  //     // wx.request({
  //     //   url: 'https://qmzg.boc7.net/moneyStatus',
  //     //   method: 'post',
  //     //   data: { data: redbag2 },//字符串转成json对象
  //     //   success: function (res) {
  //     //     var value = app.decrypt(res.data);
  //     //     console.log(value);//判断是否能够领取今日红包
  //     //     if(value.code==0){
  //           if (options && options.code) {
  //             that.setData({
  //               contactlayer: !that.data.contactlayer,
  //               giftorbattle: 4,
  //               squareballparams: { code: options.code, ranking: options.ranking, prizename: decodeURI(options.prizename), squareball: options.squareball, gamename: decodeURI(options.gamename)}
  //             });//方块球
  //           }else{
  //             that.setData({
  //               masklayer: !that.data.masklayer
  //               // layertype: 1,
  //               // opentype: 1
  //             });
  //           }
  //           // if (value.status == 1) {
  //           //   that.setData({
  //           //     envelopestatus: 1
  //           //   });
  //           // } else {
  //           //   that.setData({
  //           //     envelopestatus: 2
  //           //   });
  //           // }
  //           // if (!(options && options.envelopetype > 0) && !options.code) {
  //           // if (value.data.count == 0 && value.data.total >= 1) {
  //           //   that.setData({
  //           //     redbagtype1: 2
  //           //   });
  //           // }
  //           // if (value.data.count <= 1 && value.data.total >= 2) {
  //           //   that.setData({
  //           //     redbagtype2: 2
  //           //   });
  //           // }
  //           // if (value.data.count <= 2 && value.data.total >= 3) {
  //           //   that.setData({
  //           //     redbagtype3: 2
  //           //   });
  //           // }
  //           // if (value.data.count <= 3 && value.data.total == 4) {
  //           //   that.setData({
  //           //     redbagtype4: 2
  //           //   });
  //           // }
  //           // if (value.data.count == 1) {
  //           //   that.setData({
  //           //     redbagtype1: 3,
  //           //     moneyarr: { 'key1': value.data.money[0], 'key2': 0, 'key3': 0, 'key4': 0 }
  //           //   });
  //           // } else if (value.data.count == 2) {
  //           //   that.setData({
  //           //     redbagtype1: 3,
  //           //     redbagtype2: 3,
  //           //     moneyarr: { 'key1': value.data.money[0], 'key2': value.data.money[1], 'key3': 0, 'key4': 0 }
  //           //   });
  //           // } else if (value.data.count == 3) {
  //           //   that.setData({
  //           //     redbagtype1: 3,
  //           //     redbagtype2: 3,
  //           //     redbagtype3: 3,
  //           //     moneyarr: { 'key1': value.data.money[0], 'key2': value.data.money[1], 'key3': value.data.money[2], 'key4': 0 }
  //           //   });
  //           // } else if (value.data.count == 4) {
  //           //   that.setData({
  //           //     redbagtype1: 3,
  //           //     redbagtype2: 3,
  //           //     redbagtype3: 3,
  //           //     redbagtype4: 3,
  //           //     moneyarr: { 'key1': value.data.money[0], 'key2': value.data.money[1], 'key3': value.data.money[2], 'key4': value.data.money[3] }
  //           //   });
  //           // }
  //     that.showindexlist(token);
  //   } else {
  //     // if (options && options.userid) {
  //     //   var userdata = app.decrypt(options.userid);
  //     //   var data = { uid: userdata.uid };//token字符串转成对象
  //     //   console.log(data);
  //     //   data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
  //     //   wx.request({
  //     //     url: 'https://qmzg.boc7.net/userInfo',
  //     //     method: 'post',
  //     //     data: { data: data },//字符串转成json对象
  //     //     success: function (res) {
  //     //       console.log(res);
  //     //       var value = app.decrypt(res.data);
  //     //       console.log(value);
  //     //       if (value.code == 0) {
  //     //         that.setData({
  //     //           masklayer: !that.data.masklayer,
  //     //           layertype: 1,
  //     //           opentype: 2,
  //     //           nickname: value.data.nickname,
  //     //           headimg: value.data.headimgurl
  //     //         });
  //     //       }
  //     //     }
  //     //   })
  //     // } else 
  //     if (options && options.code) {
  //       that.setData({
  //         contactlayer: !that.data.contactlayer,
  //         giftorbattle: 4,
  //         squareballparams: { code: options.code, ranking: options.ranking, prizename: decodeURI(options.prizename), squareball: options.squareball, gamename: decodeURI(options.gamename) }
  //       });
  //     }else{
  //       that.setData({
  //         masklayer: !that.data.masklayer
  //         // layertype: 1,
  //         // opentype: 1
  //       });
  //     }
  //     token = '';
  //     that.showindexlist(token);
  //   }
  //   var countseconds = setInterval(function () {
  //     if (that.data.lotteryactive.length > 0) {
  //       var arr = that.data.lotteryactive;
  //       for (var i = 0; i < arr.length; i++) {
  //         if (arr[i].time_left>0){
  //           arr[i].time_left = arr[i].time_left - 1;
  //           // if (parseInt(arr[i].time_left / 86400) > 0) {
  //           //   arr[i].dayleft = parseInt(arr[i].time_left / 86400);
  //           //   var hours = parseInt(arr[i].time_left / 3600) - 24 * arr[i].dayleft;
  //           // } else {
  //           var hours = parseInt(arr[i].time_left / 3600);
  //           var minutes = parseInt((arr[i].time_left % 3600) / 60);
  //           var seconds = parseInt((arr[i].time_left % 3600) % 60);
  //           hours = hours < 10 ? '0' + hours : hours;
  //           minutes = minutes < 10 ? '0' + minutes : minutes;
  //           seconds = seconds < 10 ? '0' + seconds : seconds;
  //           arr[i].hours = hours;
  //           arr[i].minutes = minutes;
  //           arr[i].seconds = seconds;
  //         }
  //       }
  //       that.setData({
  //         lotteryactive: arr
  //       });
  //     }
  //   }, 1000);
  //   that.setData({
  //     countseconds: countseconds
  //   });
  // },

  /**
   * 展示首页内容
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var token = wx.getStorageSync('token');
    if (!token) {
      token = '';
    }
    var data = { token: token }; //token字符串转成对象
    data = app.encrypt(JSON.stringify(data)); //对象转成字符串加密后
    wx.request({
      url: 'https://qmzg.boc7.net/v6_getAllInfo',
      method: 'post',
      data: {
        data: data
      }, //字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0) {
          that.setData({
            activebanner: value.data.banner,
            speaknotify: value.data.exchange,
            //totalreceive: value.data.total,//今日领取红包人数
            //goodslist: value.data.goods,
            loadingHidden: true,
            hastoken: token ? 1 : 0,
            contactlayer: options && options.code ? !that.data.contactlayer : true,
            giftorbattle: options && options.code ? 4 : 0,
            squareballparams: options && options.code ? {
              code: options.code,
              ranking: options.ranking,
              prizename: decodeURI(options.prizename),
              squareball: options.squareball,
              gamename: decodeURI(options.gamename)
            } : {
              code: '',
              ranking: '',
              prizename: '',
              squareball: 0,
              gamename: ''
            },
            masklayer: !(options && options.code) ? !that.data.masklayer : true,
            countseconds: setInterval(function () {
              if (that.data.lotteryactive.length > 0) {
                var arr = that.data.lotteryactive;
                for (var i = 0; i < arr.length; i++) {
                  if (arr[i].time_left > 0) {
                    arr[i].time_left = arr[i].time_left - 1;
                    var hours = parseInt(arr[i].time_left / 3600);
                    var minutes = parseInt((arr[i].time_left % 3600) / 60);
                    var seconds = parseInt((arr[i].time_left % 3600) % 60);
                    hours = hours < 10 ? '0' + hours : hours;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    seconds = seconds < 10 ? '0' + seconds : seconds;
                    arr[i].hours = hours;
                    arr[i].minutes = minutes;
                    arr[i].seconds = seconds;
                  }
                }
                that.setData({
                  lotteryactive: arr
                });
              }
            }, 1000)
          });
          if (value.data.game.length > 0) {
            var arr1 = []; //栏目两个游戏的数据堆
            var arr2 = []; //栏目两个游戏的数据堆
            for (var j = 0; j < value.data.game.length; j++) {
              if (j % 2 == 0) {
                arr1.push(value.data.game[j]);
              } else {
                arr2.push(value.data.game[j]);
              }
            }
            that.setData({
              gamelist1: arr1,
              gamelist2: arr2
            });
          }
          var arr = value.data.recent_prize;
          for (var i = 0; i < arr.length; i++) {
            // if (parseInt(arr[i].time_left / 86400) > 0) {
            //   arr[i].dayleft = parseInt(arr[i].time_left / 86400);
            //   var hours = parseInt(arr[i].time_left / 3600) - 24 * arr[i].dayleft;
            // }else{
            var hours = parseInt(arr[i].time_left / 3600);
            var minutes = parseInt((arr[i].time_left % 3600) / 60);
            var seconds = parseInt((arr[i].time_left % 3600) % 60);
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            arr[i].hours = hours;
            arr[i].minutes = minutes;
            arr[i].seconds = seconds;
          }
          that.setData({
            lotteryactive: arr
          });
        } else {
          if (that.options && that.options.code) {
            try {
              wx.clearStorageSync();
              var str1 = JSON.stringify(that.data.squareballparams);
              wx.redirectTo({
                url: '/pages/login/login?squareball=' + str1
              })
            } catch (e) {
              console.log('Do something when catch error');
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
        }
      },
      fail: function (res) {
        console.log('获取首页信息失败');
      }
    });
  },
  
  /**
   * 点击进入游戏
   */
  clickgame: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.indextype;
    if (that.data[index][0].type == 1) {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [that.data[index][0].location_big_img] // 需要预览的图片http链接列表
      })
    }
    var arr = [];
    for (var i=0;i<that.data[index].length;i++){
      if(i>0){
        arr.push(that.data[index][i]);
      }
    }
    arr.push(that.data[index][0]);
    if (index=='gamelist1'){
      that.setData({
        gamelist1: arr
      })
    }else{
      that.setData({
        gamelist2: arr
      })
    }
  },

  /**
   * 首页轮播游戏切换
   */
  bannerjoin: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.bannertype;
    if (that.data.activebanner[index].type == 3) {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [that.data.activebanner[index].location_big_img] // 需要预览的图片http链接列表
      })
    }
  },

  /**
   * 遮罩层默认关闭红包弹框
   */
  closemask: function (e) {
    this.setData({
      masklayer: !this.data.masklayer
    })
  },

  /**
   * 客服类型弹框
   */
  closecontact: function (e) {
    this.setData({
      contactlayer: !this.data.contactlayer
    })
  },

  /**
   * 全民方块球兑换弹框
   */
  exchangesquare: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      var data = { token: token, code: that.data.squareballparams.code};//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/v7_gameExchange',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          if (value.code == 0) {
            that.setData({
              giftorbattle: 5
            });
          } else {
            wx.showToast({
              title: value.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }, fail: function (res) {
          console.log('用户兑换失败');
        }
      });
    } else {
      if (that.data.squareballparams.squareball>0){
        var str1 = JSON.stringify(that.data.squareballparams);
        wx.navigateTo({
          url: '/pages/login/login?squareball=' + str1
        });
      }
    }
  },

  /**
   * 跳转客服页面回复1
   */
  replyone: function (e) {
    if (e.currentTarget.dataset) {
      this.setData({
        contactlayer: !this.data.contactlayer,
        contactparams: e.currentTarget.dataset.params,
        giftorbattle:e.currentTarget.dataset.layertype
      })
    }
  },

  /**
   * 开红包或者分享红包弹框
   */
  // shareredbag: function (e) {
  //   if (e.currentTarget.dataset.index==1){
  //     this.setData({
  //       masklayer: !this.data.masklayer,
  //       layertype:1,
  //       opentype:1
  //     })
  //   }
  //   if (e.currentTarget.dataset.index == 2) {
  //     this.setData({
  //       masklayer: !this.data.masklayer,
  //       layertype: 2
  //     })
  //   }
  //   if (e.currentTarget.dataset.index == 3) {
  //     this.setData({
  //       layertype: 2
  //     })
  //   }
  // },

  /**
   * 开红包或者分享红包
   */
  // extractenvelope: function (e) {
  //   var that = this;
  //   var token = wx.getStorageSync('token');
  //   if (token) {
      // var data = { token: token, 'type': e.currentTarget.dataset.redbagtype };//token字符串转成对象
      // data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      // wx.request({
      //   url: 'https://qmzg.boc7.net/getMoney',
      //   method: 'post',
      //   data: { data: data },//字符串转成json对象
      //   success: function (res) {
      //     var value = app.decrypt(res.data);
      //     console.log(value);
      //     if(value.code==0){
      //       if (e.currentTarget.dataset.redbagtype == 1 || e.currentTarget.dataset.redbagtype == 3) {
      //         that.setData({
      //           opentype: 3,
      //           envelopestatus: 2,
      //           envelopereward: value.money,
      //           battle: that.data.battle - 1000
      //         })
      //       }
      //       if (e.currentTarget.dataset.redbagtype == 2) {
      //         var str = parseInt(e.currentTarget.dataset.index) + 1;
      //         var obj1 = {};
      //         obj1['redbagtype'+str] = 3;
      //         console.log(str);
      //         console.log(obj1);
      //         that.setData(obj1);
      //         var arr = that.data.moneyarr;
      //         console.log(arr);
      //         arr['key' + str] = value.money;
      //         console.log(arr);
      //         that.setData({
      //           moneyarr: arr
      //         })
      //       }
      //       if (e.currentTarget.dataset.redbagtype == 1) {
      //         that.setData({
      //           battle: that.data.battle - 1000
      //         })
      //       }
      //     }else if(value.code == 450){
      //       that.setData({
      //         masklayer: !that.data.masklayer,
      //         contactlayer: !that.data.contactlayer,
      //         giftorbattle: 1
      //       })
      //     }
      //   }, fail: function (res) {
      //     console.log('用户抽奖失败');
      //   }
      // });
  //     wx.navigateTo({
  //       url: '/pages/moneybag/moneybag'
  //     });
  //   }else{
  //     wx.navigateTo({
  //       url: '/pages/login/login'
  //     })
  //   }
  // },

  /**
   * 点击跳转链接
   */
  // jumpapplet: function (e) {
  //   var that = this;
  //   var index = e.currentTarget.dataset.index;
  //   console.log(that.data.activebanner);
  //   console.log(that.data.activebanner[index]);
  //   if (that.data.activebanner[index].type == 0) {
  //     wx.navigateToMiniProgram({
  //       appId: that.data.activebanner[index].appid,
  //       path: that.data.activebanner[index].url,
  //       extraData: {},
  //       envVersion: 'release',
  //       success(res) {
  //         console.log('成功打开小程序');
  //       }
  //     });
  //   } else {
  //     wx.previewImage({
  //       current: '', // 当前显示图片的http链接
  //       urls: [that.data.activebanner[index].location_big_img] // 需要预览的图片http链接列表
  //     })
  //   }
  // },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.countseconds);
  },

  /**
   * 广告成功回调
   */
  adsload1: function (e) {
    console.log(e);
  },

  /**
   * 广告回调失败
   */
  adsload2: function (e) {
    console.log(e);
  },

  /**
   * 监听用户刷新
   */
  onPullDownRefresh: function (res) {
    clearInterval(this.data.countseconds);
    this.setData({
      activebanner: [],
      //battle: 0,//战力值
      //totalreceive:0,//今日领取红包人数
      userid: '',//加密过的用户id
      speaknotify: [],
      loadingHidden: false,
      masklayer: true,//遮罩层默认关闭红包弹框
      contactlayer: true,//客服弹框
      //layertype: 2,//遮罩层内容类型，默认无，1红包弹框，2为解锁红包弹框
      //opentype: 4,
      // redbagtype1: 1,//1是带解锁，2是已解锁，3是已打开
      // redbagtype2: 1,
      // redbagtype3: 1,
      // redbagtype4: 1,
      //envelopestatus:1,//首页红包状态
      //moneyarr: { 'key1': 0, 'key2': 0, 'key3': 0, 'key4': 0},//四个解锁红包的领取金额
      //distinguishuser:1,//1为老用户，3为新用户，老用户进入分享点开红包，或者新用户点开分享红包
      //envelopereward:0,//开启红包的金额
      //nickname:'',
      //headimg:'',
      hastoken: 0,//用户是否登录
      contactparams: '',//访问客服界面的参数
      giftorbattle: 0,//礼包中心或者战力链接的弹框类型
      lotteryactive: [],//抽奖活动的详情
      gamelist1: [],//游戏栏目1
      gamelist2: [],//游戏栏目2
      countseconds: '',//计时装置
      squareballparams: { code: '', ranking: '', prizename: '', squareball: 0, gamename: '' }//全民方块球的相关参数
    });
    this.onLoad();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 100);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (that.data.userid) {//已经加密
      return {
        title: '【有人@你】点一下，助攻领红包啦！',
        path: 'pages/index/index?userid=' + that.data.userid,
        desc: '',
        imageUrl: 'https://qmzgcdn.boc7.net/test/index_share3.jpg'
      }
    }else{//未登录状态分享
      return {
        title: '【有人@你】点一下，助攻领红包啦！',
        path: 'pages/index/index',
        desc: '',
        imageUrl: 'https://qmzgcdn.boc7.net/test/index_share3.jpg'
      }
    }
  }
})
