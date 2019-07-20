<template>
	<Page backgroundColor="#efefef">
		<ActionBar title="My bookings"/>
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
						@tap="viewdetails(x.Ticket_ID)"
					>
						<StackLayout class="cardContent">
							<GridLayout rows="auto" columns="3*,2*">
								<Label
									:text="x.Departure_Date"
									color="#aaaaaa"
									row="0"
									col="0"
									fontSize="14"
									fontWeight="normal"
								/>
							</GridLayout>
							<GridLayout rows="auto, auto" columns="2*,*,2*">
								<Label
									:text="x.Departure_Frm"
									class="m-b-5"
									fontFamily="MuliBold"
									row="0"
									col="0"
									fontSize="20"
									textAlign="right"
								/>
								<FIcon
									name="fa-arrow-right"
									row="0"
									col="1"
									fontSize="18"
									verticalAlign="center"
									paddingTop="12"
								/>
								<Label
									:text="x.Departure_To"
									class="m-b-5"
									fontFamily="MuliBold"
									row="0"
									col="2"
									fontSize="20"
								/>
							</GridLayout>

							<GridLayout columns="*,2*,*" rows="auto" marginTop="40px">
								<Label
									v-if="x.Request_Status=='Approved By HOD'"
									row="0"
									col="1"
									fontSize="14"
									color="#00ee00"
									class="fa"
									textAlign="center"
								>{{'fa-check-circle' | fonticon}} Approved By HOD</Label>

								<Label
									v-if="x.Request_Status=='Pending'"
									row="0"
									col="1"
									fontSize="14"
									color="#ec7600"
									class="fa"
									textAlign="center"
								>{{'fa-exclamation-triangle' | fonticon}} Pending</Label>
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
import Details from './Details'
export default {
	data() {
		return {
			bookings: [],
			loaded: false
		};
	},

	created() {
		axios.get("http://220.225.138.75/MSTCInternalServices/MSTCServices.svc/GetAirTicketSummary/"+localStorage.getItem("empcode")).then(response => {
			this.bookings = response.data.GetAirTicketSummaryResult;
			this.loaded = true;
		})
	},

	methods: {
		refreshList(args) {
			var pullRefresh = args.object;
			axios.get(
				"http://220.225.138.75/MSTCInternalServices/MSTCServices.svc/GetAirTicketSummary/05452"
			).then(response => {
				this.bookings = response.data.GetAirTicketSummaryResult;
				this.loaded = true;
				pullRefresh.refreshing = false;
			});
		},

		viewdetails(x){
			this.$showModal(Details,{fullscreen: true,props: { id: x }})
		}
	}
};
</script>

<style>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}
.cardStyle {
  background-color: #fff;
  color: rgb(43, 43, 43);
  margin: 20px;
}

.cardContent {
  padding: 20;
  font-weight: bold;
  font-size: 30;
}
</style>
