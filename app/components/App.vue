<template>
	<Page>
		<ActionBar title="Book a ticket">
			<ActionItem
				@tap="onView"
				ios.systemIcon="2"
				ios.position="left"
				android.systemIcon="ic_menu_myplaces"
				android.position="actionBar">
			</ActionItem>
			<ActionItem
				@tap="gotoapprove"
				v-if="isApprover"
				ios.systemIcon="16"
				ios.position="right"
				text="Approve"
				android.position="popup">
			</ActionItem>
			<ActionItem
				@tap="signout"
				ios.systemIcon="16"
				ios.position="right"
				text="Sign Out"
				android.position="popup">
			</ActionItem>
		</ActionBar>

		<ScrollView margin="10">
			<StackLayout v-if="loaded">
				<GridLayout rows="40,50,40,50">
					<Label text="From" row="0" paddingTop="10" />
					<RadAutoCompleteTextView
						@textChanged="setfromair"
						:items="states"
						ref="fromair"
						suggestMode="Suggest"
						displayMode="Plain"
						completionMode="Contains"
						row="1"
						hint="Airport name"
						backgroundColor="#eeeeee"
						v-model="selection">
							<SuggestionView ~suggestionView>
								<StackLayout v-suggestionItemTemplate orientation="vertical" padding="10">
									<v-template scope="item">
									<Label :text="item.text" android:marginTop="15" android:marginLeft="15" />
									</v-template>
								</StackLayout>
							</SuggestionView>
					</RadAutoCompleteTextView>
					<Label text="To" row="2" paddingTop="10" />
					<RadAutoCompleteTextView
						@textChanged="settoair"
						:items="states"
						ref="fromair"
						suggestMode="Suggest"
						displayMode="Plain"
						completionMode="Contains"
						row="3"
						hint="Airport name"
						backgroundColor="#eeeeee"
						v-model="selection">
							<SuggestionView ~suggestionView>
								<StackLayout v-suggestionItemTemplate orientation="vertical" padding="10">
									<v-template scope="item">
									<Label :text="item.text" android:marginTop="15" android:marginLeft="15" />
									</v-template>
								</StackLayout>
							</SuggestionView>
					</RadAutoCompleteTextView>
				</GridLayout>
				<Label text="Departure Date" style="text-align: center; width:100%;" marginTop="15px" />
				<DatePicker v-model="form.fromdate" />
				<Label text="Departure Time" style="text-align: center; width:100%;" />
				<TimePicker v-model="form.fromtime" />

				<Label text="Return Date" style="text-align: center; width:100%;" />
				<DatePicker v-model="form.todate" />
				<Label text="Return Time" style="text-align: center; width:100%;" />
				<TimePicker v-model="form.totime" />

				<Label text="Contact No" />
				<TextField
					hint="Enter mobile number..."
					keyboardType="phone"
					padding="20"
					backgroundColor="#efefef"
					v-model="form.contact"
				/>
				<Label text="Remarks" />
				<TextView
					text
					editable="true"
					hint="Enter remarks (optional)"
					padding="20"
					backgroundColor="#efefef"
					v-model="form.remarks"
				/>
				<Button
					@tap="submit"
					text="Submit Request"
					class="btn btn-primary"
					backgroundColor="#3737d1"
					margin="25px"
				/>
			</StackLayout>
			<GridLayout v-else rows="auto">
				<ActivityIndicator :busy="processing"></ActivityIndicator>
			</GridLayout>
		<!-- <StackLayout>
			<RadDataForm :source="booking" commitMode="Immediate" ref="bookingform" :validationMode="DataFormValidationMode.Immediate">
			<TKEntityProperty
				v-tkDataFormProperty
				name="from"
				displayName="From Airport"
				index="0"
				:valuesProvider="states"
				backgroundColor="#ee0000"
			>
				<TKPropertyEditor v-tkEntityPropertyEditor type="AutoCompleteInline" v-model="form.from"></TKPropertyEditor>
			</TKEntityProperty>

			<TKEntityProperty
				v-tkDataFormProperty
				name="to"
				displayName="To Airport"
				index="1"
				:valuesProvider="states"
			>
				<TKPropertyEditor v-tkEntityPropertyEditor type="AutoCompleteInline"></TKPropertyEditor>
			</TKEntityProperty>
			<TKEntityProperty
				v-tkDataFormProperty
				name="fromdate"
				displayName="Departure Date"
				index="2"
			>
				<TKPropertyEditor v-tkEntityPropertyEditor type="DatePicker"></TKPropertyEditor>
			</TKEntityProperty>
			<TKEntityProperty v-tkDataFormProperty name="todate" displayName="Return Date" index="3">
				<TKPropertyEditor v-tkEntityPropertyEditor type="DatePicker"></TKPropertyEditor>
			</TKEntityProperty>
			<TKEntityProperty
				v-tkDataFormProperty
				name="fromtime"
				displayName="Departure Time"
				index="4"
			>
				<TKPropertyEditor v-tkEntityPropertyEditor type="TimePicker"></TKPropertyEditor>
			</TKEntityProperty>
			<TKEntityProperty v-tkDataFormProperty name="totime" displayName="Return Time" index="5">
				<TKPropertyEditor v-tkEntityPropertyEditor type="TimePicker"></TKPropertyEditor>
			</TKEntityProperty>
			<TKEntityProperty
				v-tkDataFormProperty
				name="contactno"
				displayName="Contact No"
				index="6"
			>
				<TKPropertyEditor v-tkEntityPropertyEditor type="Phone"></TKPropertyEditor>
			</TKEntityProperty>
			<TKEntityProperty v-tkDataFormProperty name="remarks" displayName="Remarks" index="7">
				<TKPropertyEditor v-tkEntityPropertyEditor type="MultilineText"></TKPropertyEditor>
			</TKEntityProperty>
			</RadDataForm>
			<Button
			@tap="submit"
			text="Submit Request"
			class="btn btn-primary"
			backgroundColor="#3737d1"
			margin="25px"
			/>
		</StackLayout>-->
		</ScrollView>
	</Page>
</template>

<script >
import View from "./View";
import Login from "./Login";
import Approve from "./Approve";
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const autocompleteModule = require("nativescript-ui-autocomplete");
import axios from "axios";
export default {
	data() {
		return {
			processing: true,
			selection: "",
			loaded: false,
			states: [],
			allstates: [],
			form: {
				from: "",
				to: "",
				fromdate: new Date(),
				fromtime: new Date(),
				todate: new Date(),
				totime: new Date(),
				contact: "",
				remarks: ""
			}
		};
	},
  	created() {
		var a = [];
		if (!localStorage.getItem("isLoggedIn")) this.$navigateTo(Login);

		axios.get(
			"http://220.225.138.75/MSTCInternalServices/MSTCServices.svc/GetAirports"
		).then(response => {
			this.allstates = response.data.GetAirportsResult;
			response.data.GetAirportsResult.forEach(element => {
				a.push(new autocompleteModule.TokenModel(element.Airport_Name + " - " + element.State_Name,undefined));
			});
		}).then(() => {
			this.states = new ObservableArray(a);
			this.loaded = true;
			this.processing = false;
		});
	},
	methods: {
		formatAMPM(date) {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? "PM" : "AM";
			hours = hours % 12;
			hours = hours ? hours : 12;
			minutes = minutes < 10 ? "0" + minutes : minutes;
			var strTime = hours + "-" + minutes + " " + ampm;
			return strTime;
		},
		submit() {
			var p ="http://220.225.138.75/MSTCInternalServices/MSTCServices.svc/InsertAirTicketRequest/" +
				localStorage.getItem("empcode") +"/" +
				this.form.from +"/" +
				this.form.fromdate.getUTCMonth() +"-" +
				this.form.fromdate.getDate() +"-" +
				this.form.fromdate.getUTCFullYear() +"/" +
				this.formatAMPM(this.form.fromtime) +"/" +
				this.form.to +"/" +
				this.form.todate.getUTCMonth() +"-" +
				this.form.todate.getDate() +"-" +
				this.form.todate.getUTCFullYear() +"/" +
				this.formatAMPM(this.form.totime) +"/" +
				this.form.remarks +"/" +
				this.form.contact;
			console.log(p);
			axios.get(p).then(response => {
				axios.post("https://fcm.googleapis.com/fcm/send",
					{
						notification: {
							title: "New Air Ticket Request",
							text: response.data.InsertAirTicketRequestResult.Message,
							badge: "1",
							sound: "default",
							// click_action: "general"
						},
						priority: "High",
						to: response.data.InsertAirTicketRequestResult.DeviceID,
						"showWhenInForeground": true,
					},
					{
						headers: {
							Authorization:"key=AAAAuFpA2bs:APA91bGuALwbNnWttWL_hAo1qDn0nwTLFyA8w3fQymiNCcOz1-I_XKfnBdmq3aUCwPGf0Z-TCY9dq6gPiaO2oAH--QccZVvCFMaABmpKrl47NmyWUHzd75Hbmcy5jE-gwIooV9FJdtv9",
							"Content-Type": "application/json"
						}
					}
				).then(() => {
					alert({
						title: "Booking Confirmed",
						message: "Your request for booking has been successfully placed!",
						okButtonText: "Ok"
					}).then(() => {
						this.$navigateTo(View);
					});
				}).catch(err => {
					console.log(err.response);
				});
			});
		},

		setfromair({ text }) {
			this.allstates.forEach(element => {
				if (element.Airport_Name + " - " + element.State_Name == text) {
					this.form.from = element.Airport_ID;
					return false;
				}
			});
		},
		settoair({ text }) {
			this.allstates.forEach(element => {
				if (element.Airport_Name + " - " + element.State_Name == text) {
					this.form.to = element.Airport_ID;
					return false;
				}
			});
		},
		gotoapprove() {
			this.$navigateTo(Approve);
		},
		onView() {
			this.$navigateTo(View);
		},
		signout() {
			localStorage.clear();
			this.$navigateTo(Login);
		}
	},
	computed: {
		isApprover() {
			try {
				return localStorage.getItem("approver");
			} catch (e) {
				return false;
			}
		}
	}
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}
label {
  font-weight: bold;
  font-size: 16pt;
}
TKPropertyEditor {
  background-color: #aaaaaa;
}
</style>
