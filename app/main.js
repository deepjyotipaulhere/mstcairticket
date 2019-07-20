import Vue from 'nativescript-vue'
import App from './components/App'
import View from './components/View'
import Login from './components/Login'
import FontIcon from 'nativescript-vue-fonticon'
import RadAutoCompleteTextView from 'nativescript-ui-autocomplete/vue';
import RadDataForm from 'nativescript-ui-dataform/vue';
import VueDevtools from 'nativescript-vue-devtools'

if (TNS_ENV !== 'production') {
	Vue.use(VueDevtools, {
		host: '10.1.3.190'
	})
}
require('nativescript-localstorage')
Vue.config.silent = (TNS_ENV === 'production')
// Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer);
Vue.registerElement("DropDown", () => require("nativescript-drop-down/drop-down").DropDown);
Vue.registerElement("CardView", () => require("nativescript-cardview").CardView);
Vue.registerElement("FilterSelect", () => require("nativescript-filter-select").FilterSelect);
Vue.registerElement('PullToRefresh',() => require('nativescript-pulltorefresh').PullToRefresh);
Vue.use(FontIcon, {
	componentName: 'FIcon', // <-- Optional. Will be the name for component icon.
	// debug: true, // <-- Optional. Will output the css mapping to console.
	paths: {
		fa: './assets/css/fontawesome.css',
		ion: './assets/css/ionicons.css'
	}
})
Vue.use(RadAutoCompleteTextView);
Vue.use(RadDataForm);


new Vue({
  	render: h => h('frame', [h(localStorage.getItem("isLoggedIn")=='true'?App:Login)])
}).$start()
