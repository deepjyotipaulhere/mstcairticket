<template>
	<Page actionBarHidden="true">
		<FlexboxLayout class="page">
		<StackLayout class="form">
			<Image class="logo" src="res://icon"></Image>
			<Label
				class="header"
				text="Air Ticket Booking"
				fontFamily="RobotoSlab-Regular"
				fontSize="30"
				fontWeight="100"
			></Label>

			<GridLayout rows="auto, auto, auto">
			<StackLayout row="0" class="input-field">
				<TextField
					class="input"
					hint="PNA Login ID"
					autocorrect="false"
					autocapitalizationType="none"
					v-model="user.email"
					returnKeyType="next"
					padding="10"
					backgroundColor="#efefef"
				></TextField>
				<StackLayout class="hr-light"></StackLayout>
			</StackLayout>

			<StackLayout row="1" class="input-field">
				<TextField
					class="input"
					ref="password"
					hint="PNA Password"
					secure="true"
					v-model="user.password"
					padding="10"
					backgroundColor="#efefef"
				></TextField>
				<StackLayout class="hr-light"></StackLayout>
			</StackLayout>

			<ActivityIndicator rowspan="3" :busy="processing"></ActivityIndicator>
			</GridLayout>

			<Button :isEnabled="!processing" @tap="submit" class="btn btn-primary m-t-2" text="Login"></Button>
		</StackLayout>

		<Label class="login-label sign-up-label">
			<FormattedString>
				<Span :text="'Developed by MSTC'"></Span>
			</FormattedString>
		</Label>
		</FlexboxLayout>
	</Page>
</template>

<script>
import axios from "axios";
import App from "./App";
import { messaging, Message } from 'nativescript-plugin-firebase/messaging'
export default {
	data() {
		return {
			isLoggingIn: true,
			processing: false,
			user: {
				email: "",
				password: ""
			},
			deviceid:''
		};
	},
	created() {
		if (localStorage.getItem('isLoggedIn')=='true'){
			this.$navigateTo(App);
		}
		const model = new messaging.PushNotificationModel();
		model.onNotificationActionTakenCallback = (actionIdentifier, message) => {
			console.log(`onNotificationActionTakenCallback fired! Message: ${JSON.stringify(message)}, Action taken: ${actionIdentifier}`);
		};
		messaging.registerForPushNotifications({
			onPushTokenReceivedCallback: (token) => {
				console.log("Firebase plugin received a push token: " + token);
				this.deviceid=token
			},

			onMessageReceivedCallback: (message) => {
				console.log("Push message received: " + JSON.stringify(message));
			},

			showNotifications: true,

			showNotificationsWhenInForeground: true

		}).then(() => console.log("Registered for push"));

		messaging.getCurrentPushToken().then(token => console.log('Current push token: ${token}'));
		messaging.registerForInteractivePush(model);
	},
	mounted() {
		if (localStorage.getItem('isLoggedIn')=='true'){
			this.$navigateTo(App);
		}
	},
	methods: {
		submit() {
			this.processing = true;

			if (!this.user.email || !this.user.password) {
				alert("Please provide both an email address and password.");
				this.processing = false;
				return;
			}
			axios.get("http://220.225.138.75/MSTCInternalServices/MSTCServices.svc/AuthenticateUser/"+this.user.email+"/"+this.user.password+"/"+this.deviceid.replace(":","@"))
			.then(response => {
				if (response.data.AuthenticateUserResult.Result) {
					this.processing = false;
					localStorage.setItem("isLoggedIn", true);
					localStorage.setItem("empcode", response.data.AuthenticateUserResult.EmpCode);
					localStorage.setItem("name", response.data.AuthenticateUserResult.Username);
					localStorage.setItem("region", response.data.AuthenticateUserResult.RegionCode);
					var p=response.data.AuthenticateUserResult.Role.split(",")
					p.forEach(element => {
					if (element=='A004')
						localStorage.setItem("approver", true);
					});
					this.processing = false;
					this.$navigateTo(App);


				} else {
					this.processing = false;
					alert({
						title: "Login Failed",
						message: "Your Login ID and Password do not match!",
						okButtonText: "Ok"
					});
				}
			});
		}
	}
};
</script>

<style>
.page {
  align-items: center;
  flex-direction: column;
}

.form {
  margin-left: 30;
  margin-right: 30;
  flex-grow: 2;
  vertical-align: middle;
}

.logo {
  margin-bottom: 12;
  height: 90;
  font-weight: bold;
}

.header {
  horizontal-align: center;
  font-size: 25;
  font-weight: 600;
  margin-bottom: 70;
  text-align: center;
  color: #1a90d5;
}

.input-field {
  margin-bottom: 25;
}

.input {
  font-size: 18;
  placeholder-color: #a8a8a8;
}

.input:disabled {
  background-color: white;
  opacity: 0.5;
}

.btn-primary {
  margin: 30 5 15 5;
  background-color: #3737d1;
  color: white;
  padding: 5px 0;
}

.login-label {
  horizontal-align: center;
  color: #a8a8a8;
  font-size: 16;
}

.sign-up-label {
  margin-bottom: 20;
}

.bold {
  color: #000000;
}
</style>
