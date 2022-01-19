const localPrefs = require('../localprefs')
const i18nMessages = require('../messages.json')
const caps = require('ssb-caps')

module.exports = function () {
  return {
    template: `
       <div id="channel">
<!--         <h2>{{ $t('settings.title') }}</h2>
         <p>
         <label for="appTitle">{{ $t('settings.appTitle') }}</label><br />
         <input type="text" id="appTitle" v-model="appTitle" :placeholder="$t('settings.appTitlePlaceholder')" />
         </p>
-->
         <p>
         <label for="locale">{{ $t('settings.language') }}</label><br />
         <select id="locale" v-model="locale">
           <option v-for="locale in localeOptions" :value="locale.locale">{{ locale.name }}</option>
         </select>
         </p>

         <p>
         <label for="theme">{{ $t('settings.colorTheme') }}</label><br />
         <select id="theme" v-model="theme">
         <option value="pirateship">Default</option>
         <option value="dark">Dark</option>
         <option value="ethereal">Ethereal</option>
         <option value="seigaihasubtle">Seigaiha Subtle</option>
         <option value="floralgardenbird">Floral Garden</option>
         </select>
         </p>
<!--
         <p>
         <label for="replicationHops">{{ $t('settings.replicateHops') }}</label><br />
         <select id="replicationHops" v-model="hops">
         <option value="1">1 {{ $t('settings.directFollows') }}</option>
         <option value="2">2</option>
         <option value="3">3</option>
         <option value="4">4</option>
         <option value="5">5</option>
         </select>
         <span v-if="hops > 2"><br /><strong>{{ $t('settings.highHopCountWarning') }}</strong></span>
         </p>

         <p>
         <input type="checkbox" id="autorefresh" v-model="autorefresh" />
         <label for="autorefresh">{{ $t('settings.autorefresh') }}</label>
         </p>

         <p>
         <input type="checkbox" id="dhtEnabled" v-model="dhtEnabled" />
         <label for="dhtEnabled">{{ $t('settings.dhtEnabled') }}</label>
         </p>

         <p>
         <label for="searchDepth">{{ $t('settings.searchDepth') }}</label><br />
         <input type="number" id="searchDepth" v-model="searchDepth" min="1000" max="1000000" step="1000" />
         </p>

         <p>
         <label for="caps"><strong>{{ $t('settings.advanced') }}</strong> - {{ $t('settings.capsKey') }}</label><br />
         <input type="text" id="caps" v-model="caps" :placeholder="$t('settings.capsKeyPlaceholder')" /><br />
         <small>{{ $t('settings.capsKeyWarning') }}</small>
         </p>

         <p>
         <input type="checkbox" id="detailedLogging" v-model="detailedLogging" />
         <label for="detailedLogging"><strong>{{ $t('settings.advanced') }}</strong> - {{ $t('settings.detailedLogging') }}</label>
         </p>
-->
         <button class="clickButton" v-on:click="save()">{{ $t('common.save') }}</button>
       <div>`,

    props: ['channel'],

    data: function() {
      return {
        appTitle: '',
        theme: 'default',
        caps: '',
        locale: 'en',
        localeOptions: [],
        autorefresh: false,
        dhtEnabled: false,
        detailedLogging: false,
        searchDepth: 10000,
        hops: 2
      }
    },

    methods: {
      render: function () {
        this.appTitle = localPrefs.getAppTitle()
        this.theme = localPrefs.getTheme()
        this.hops = localPrefs.getHops()
        this.caps = (localPrefs.getCaps() == caps.shs ? '' : localPrefs.getCaps())
        this.locale = localPrefs.getLocale()
        this.localeOptions = [{ locale: "", name: this.$root.$t('settings.useSystemDefault')}];
        for (var l in i18nMessages)
          this.localeOptions.push({ locale: l, name: i18nMessages[l].language })
        this.autorefresh = localPrefs.getAutorefresh()
        this.dhtEnabled = localPrefs.getDHTEnabled()
        this.searchDepth = localPrefs.getSearchDepth()
        this.detailedLogging = localPrefs.getDetailedLogging()
      },

      save: function () {
        localPrefs.setAppTitle(this.appTitle)
        localPrefs.setTheme(this.theme)
        localPrefs.setHops(this.hops)
        localPrefs.setCaps(this.caps)
        var defaultLocale = (navigator.language || (navigator.languages ? navigator.languages[0] : navigator.browserLanguage ? navigator.browserLanguage : null))
        localPrefs.setLocale(this.locale)
        if(this.locale && this.locale != '')
          this.$i18n.locale = this.locale
        else if(i18nMessages[defaultLocale])
          this.$i18n.locale = defaultLocale
        else
          this.$i18n.locale = 'en'

        localPrefs.setAutorefresh(this.autorefresh)
        localPrefs.setDHTEnabled(this.dhtEnabled)

        localPrefs.setSearchDepth(this.searchDepth)
        if (SSB.search.depth != this.searchDepth) {
          SSB.search.depth = this.searchDepth
          SSB.search.resetIndex()
        }

        localPrefs.setDetailedLogging(this.detailedLogging)

        localPrefs.updateStateFromSettings()

        alert(this.$root.$t('settings.refreshForChanges'));
      }
    },

    created: function () {
      document.title = this.$root.appTitle + " - " + this.$root.$t('settings.title')

      this.render()
    },
  }
}
