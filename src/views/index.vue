<template>
  <body>
    <div class="row-masthead parallax-window" data-parallax="scroll">
      <div class="container">
        <div class="row">
          <div class="col-md-6 main-title">Draw Your Network</div>
          <div class="col-md-6 sign">
            <button class="button button-glow button-border button-rounded button-primary" @click="Jump('/login')">Sign in</button>
            <button class="button button-glow button-border button-rounded button-primary" @click="Jump('/register')">Sign up</button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div style="height: 50px;" />
      <div class="row">
        <div class="col-md-5">
          <h2>Local Area Network</h2>
          <h5 style="margin-top: 30px;">A local-area network (LAN) is a computer network that spans a relatively small area. Most often, a LAN is confined to a single room, building or group of buildings, however, one LAN can be connected to other LANs over any distance via telephone lines and radio waves.</h5>
        </div>
        <div class="col-md-2" />
        <div class="col-md-5">
          <h2>Network Topology</h2>
          <h5 style="margin-top: 30px;">Network topology is the arrangement of the elements of a communication network.Network topology can be used to define or describe the arrangement of various types of telecommunication networks, including command and control radio networks, industrial fieldbusses and computer networks.</h5>
        </div>
      </div>
    </div>

    <div class="row-full-image parallax-window" data-parallax="scroll" data-image-src="assets/fullimage.jpg" style="margin-top: 50px;" />

    <section class="testomial-area section-gap">
      <div class="container">
        <div class="row d-flex justify-content-center">
          <div class="menu-content pb-60 col-lg-8">
            <div class="title text-center">
              <h1 class="mb-10">About Me</h1>
              <p>Chris Ju</p>
            </div>
          </div>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="active-tstimonial-carusel">
            <div class="single-testimonial item">
              <img class="mx-auto col-md-4" src="@/assets/images/photo.png">
              <p class="desc"></p>
              <h4>Ju Bo</h4>
              <p>
                Graduate of Sun Yat-sen University
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="footer-area section-gap">
      <div class="container">
        <div class="row">
          <div class="col-md-8">
            <h2>Technology Stack</h2>
            <div style="height: 20px;" />
            <div class="row">
              <div class="col-md-4 col-xs-6">
                <h5>Front End</h5>
                <ul>
                  <li><a href="https://cn.vuejs.org/index.html">vue</a></li>
                  <li><a href="https://panjiachen.github.io/vue-element-admin-site/zh/guide/">vue-element-admin</a></li>
                  <li><a href="https://github.com/visjs/vis-network/">vis-network</a></li>
                </ul>
              </div>
              <div class="col-md-4 col-xs-6">
                <h5>Back End</h5>
                <ul>
                  <li><a href="https://golang.org/">Golang</a></li>
                  <li><a href="https://github.com/gin-gonic/gin">Gin</a></li>
                  <li><a href="https://grpc.io/">gRPC</a></li>
                  <li><a href="https://www.mysql.com/">Mysql</a></li>
                  <li><a href="https://www.mongodb.com/">MongoDB</a></li>
                </ul>
              </div>
              <div class="col-md-4 col-xs-6">
                <h5>Algorithm</h5>
                <ul>
                  <li>Marshall</li>
                  <li>Dijkstra</li>
                  <li>...</li>
                </ul>
              </div>
            </div>
            <div class="row-spacer" />
          </div>
          <div class="col-md-4 col-sm-4">
            <h3>Contact Me</h3>
            <label class="label-text">Email: chris-ju@qq.com</label>
            <label class="label-text">Github: <a href="https://github.com/Chris-Ju">Chris-Ju</a></label>
          </div>
        </div>
      </div>
    </footer>
  </body>
</template>

<style scoped>

@import '../assets/css/styles.css';
@import '../assets/css/bootstrap.css';
@import '../assets/css/button.css';

.main-title {
  margin-top: 100px;
  font: 700 50px "Comic Sans MS";
    color: white;
    text-shadow: 0 0 20px #fdec84,
            10px -10px 30px #ffae35,
            20px -20px 40px #ec760c,
            -20px -60px 50px #cd4607,
            0px -80px 60px #973717,
            10px -40px 70px #451b0e;
}

</style>

<script>

import $ from 'jquery'

export default {
  name: 'Index',
  data() {
    return {
      background: '@/assets/images/masthead.jpg'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      var $gridRow = $('.row-grid')
      if ($gridRow.length) {
        var $mainContainer = $('.container:first .row:first')
        var pad = $mainContainer.position().left + 15

        $gridRow.each(() => {
          var $container = $(this).find('.container')
          var $rows = $container.find('.row')
          var containerWidth = 0
          $rows.each(() => {
            var $cols = $(this).find('.grid')
            var totalWidth = 0
            $cols.each(() => {
              totalWidth += $(this).outerWidth()
            })
            if (totalWidth > containerWidth) {
              containerWidth = totalWidth
            }
          })
          containerWidth -= 30
          containerWidth += (pad * 2)
          $container.width(containerWidth).css('padding', '0 ' + pad + 'px')
        })
      }
    },
    Jump(path) {
      this.$router.push({ path: path })
    }
  }
}
</script>
