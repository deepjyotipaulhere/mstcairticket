<template>
	<Page>
		<ActionBar title="Approve Requests">
			<ActionItem
				@tap="onView"
				ios.systemIcon="2"
				ios.position="left"
				android.systemIcon="ic_menu_home"
				android.position="actionBar">
			</ActionItem>
		</ActionBar>
		<PullToRefresh @refresh="refreshList">
			<ScrollView>
				<StackLayout v-if="loaded">
					<CardView
						class="cardStyle"
						ripple="true"
						elevation="5"
						radius="5px"
						v-for="(x,i) in bookings"
						:key="i"
						@tap="viewdetails(x.Ticket_ID)">
						<StackLayout class="cardContent">
							<GridLayout rows="auto" columns="3*,*">
								<Label
									:text="x.Requestor_name"
									row="0"
									col="0"
									fontSize="19"
									fontWeight="bold"
								/>
								<Label text="Pending" row="0" col="1" fontSize="12" color="orange" v-if="x.Approver_Status=='Pending'" />
								<Label text="Approved" row="0" col="1" fontSize="12" color="green" v-else />
							</GridLayout>
							<GridLayout rows="auto" columns="3*,*">
								<Label
									:text="'Requested on '+x.Request_Date"
									class="m-b-5"
									style="border-left:1px solid blue;"
									row="0"
									col="0"
									fontSize="16"
									textAlign="right"
									color="#aaaaaa"
									fontWeight="light"
									horizontalAlign="right"
								/>
								<Label
									row="0"
									col="1"
									fontSize="12"
									color="#bbbbbb"
									textAlign="center">Ticket ID: {{x.Ticket_ID}}</Label>
							</GridLayout>
						</StackLayout>
					</CardView>
				</StackLayout>
			</ScrollView>
		</PullToRefresh>
	</Page>
</template>

<script>
import axios from "axios";
import App from './App'
import ApproveDetails from './ApproveDetails'
export default {
	data() {
		return {
			bookings: [],
			loaded: false
		};
	},

	created() {
		axios.get(
			"http://220.225.138.75/MSTCInternalServices/MSTCServices.svc/GetPendingHODAirTicketList/"+localStorage.getItem("empcode")
		).then(response => {
			this.bookings = response.data.GetPendingHODAirTicketListResult;
			this.loaded = true;
		})
	},

	methods: {
		refreshList(args) {
			var pullRefresh = args.object;
			axios.get("http://220.225.138.75/MSTCInternalServices/MSTCServices.svc/GetPendingHODAirTicketList/"+localStorage.getItem("empcode"))
			.then(response => {
				this.bookings = response.data.GetPendingHODAirTicketListResult;
				pullRefresh.refreshing = false;
			});
		},

		viewdetails(x) {
			this.$showModal(ApproveDetails,{fullscreen: true,props: { id: x }}).then(()=>{
				axios.get(
					"http://220.225.138.75/MSTCInternalServices/MSTCServices.svc/GetPendingHODAirTicketList/"+localStorage.getItem("empcode")
				).then(response => {
					this.bookings = response.data.GetPendingHODAirTicketListResult;
				});
			})
		},
		onView(){
			this.$navigateTo(App)
		}
  	}
};
</script>

<style>
</style>
