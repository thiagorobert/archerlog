const localPrefs = require('../localprefs')

const ssbMentions = require('ssb-mentions')
const ssbSingleton = require('ssb-browser-core/ssb-singleton')

module.exports = function () {
  return {
    template: `
<div class="container">

    <section id="visuals">
        <div id="target">
            <div class="ring white" score="1"></div>
            <div class="ring white" score="2"></div>
            <div class="ring black" score="3"></div>
            <div class="ring black" score="4"></div>
            <div class="ring blue" score="5"></div>
            <div class="ring blue" score="6"></div>
            <div class="ring red" score="7"></div>
            <div class="ring red" score="8"></div>
            <div class="ring gold" score="9"></div>
            <div class="ring gold ten-ring" score="10"></div>
            <div class="ring x-ring" score="X"></div>
            <div id="mouse-coordinates">
                <div>X: <span id="mouse-x">0.0</span></div>
                <div>Y: <span id="mouse-y">0.0</span></div>
            </div>
            <div id="group-center-indicator"></div>
        </div>
        <div class="controls">
            <div class="range">
                <span id="current">0</span>
                <input id="slider" type="range" min="0" max="0" value="0">
                <span id="total">0</span>
            </div>
            <div id="player">
                <span id="rewind" class="disabled"></span>
                <span id="play" class="disabled"></span>
                <span id="pause" class="inactive"></span>
                <span id="fast-forward" class="disabled"></span>
            </div>
        </div>
    </section>

    <section id="data">
        <div class="cards">
            <table id="input" class="card">
                <tr>
                    <td>
                        X:<input type="text" id="x-coordinate" />
                        Y:<input type="text" id="y-coordinate" />
                        <input type="submit" value="enter" class="button disabled" title="Submit 
coordinates" id="enter-coordinates" />
                    </td>
                </tr>
            </table>

            <table id="stats" class="card">
                <tr>
                    <th>STATS</th>
                </tr>
                <tr>
                    <td>Total Score:<span id="total-score">0/0</span></td>
                </tr>
                <tr>
                    <td>Average Score:<span id="average-score">0.0</span></td>
                </tr>
                <tr>
                    <td>Average Variance:<span id="average-variance">0.0</span></td>
                    <tr>
                        <td>Group Center:<span id="group-center">0.0, 0.0</span></td>
                    </tr>
                </table>
                <table id="shots" class="card">
                    <tr>
                        <th colspan="4">SHOTS<!--<a id="clear-log" class="button" title="Erase shot history">Clear Log</a>--></th>
                    </tr>
                    <tr>
                        <td>#</td>
                        <td>Score</td>
                        <td>Coordinates</td>
                        <td>Variance</td>
                    </tr>
                    <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
    <!-- this is a hack to load the required function -->
    <img src onerror='runTarget()'>
    <onboarding-dialog v-bind:show="showOnboarding" v-bind:onClose="closeOnboarding"></onboarding-dialog>

    <div id="postform" class="new-message">
      <markdown-editor initialValue="postText" ref="markdownEditor" />
    </div>
    <button class="clickButton" id="postMessage" v-on:click="confirmPost">Post</button>

</div>
`,

    data: function() {
      return {
        appTitle: '',
        showOnboarding: window.firstTimeLoading,
        postMessageVisible: false
      }
    },

    methods: {
      closeOnboarding: function() {
        this.showOnboarding = false

        // We're set up.  We don't need this anymore and don't want it popping back up next time Public is loaded.
        window.firstTimeLoading = false
      },

      render: function () {
        this.appTitle = localPrefs.getAppTitle()
      },

      buildPostData: function() {
        var mentions = ssbMentions("")

        //var postText = this.$refs.markdownEditor.getMarkdown()
        var postText = "Total points: " + stats.totalPoints + "\n"
            + "Average score: " + stats.averageScore + "\n"
            + "Average variance: " + stats.averageVariance + "\n"
            + "Group center: " + stats.groupCenter;

        var postData = { type: 'post', text: postText, mentions: mentions }

        return postData
      },

      confirmPost: function() {
        [ err, SSB ] = ssbSingleton.getSSB()
        if (!SSB || !SSB.db) {
          alert("Can't post right now.  Couldn't lock database.  Please make sure you only have one instance of targetlog.com running.")
          return
        }

        var self = this

        var postData = this.buildPostData()

        SSB.db.publish(postData, (err) => {
          if (err) console.log(err)

          self.postText = ""
          self.postChannel = ""
          self.postMessageVisible = false
          self.showPreview = false
          if (self.$refs.markdownEditor)
            self.$refs.markdownEditor.setMarkdown(self.descriptionText)

          self.refresh()
        })
      },

      save: function () {
        localPrefs.setAppTitle(this.appTitle)
      },

      refresh: function () {
        //this.$router.push({ name: 'target' })
        //this.$router.go()
      }
    },

    created: function () {

      // I'm not sure what $root and $t resolve to here. It seems there's a lot of logic to set document.title, including a fallback in browser.js
      // to set it to 'localPrefs.getAppTitle()' in case a tab doesn't set it.

      document.title = "archerlog.com"

      // This setting made the difference when trying to make this page show the onboarding dialog, but I'm not sure why.
      var self = this

      window.updateFirstTimeLoading = function() {
        self.showOnboarding = window.firstTimeLoading
      }

      this.render()
    },
  }
}
