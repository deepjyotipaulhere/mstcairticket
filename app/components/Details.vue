<template>
	<Page backgroundColor="#efefef">
		<ActionBar title="My bookings"/>
		<StackLayout style="padding:30px;">
			<Label fontSize="26" marginBottom="20"><Span>Ticket ID: </Span><Span fontWeight="bold">{{id}}</Span></Label>/>
			<GridLayout columns="*,*" rows="50,50,50,50,50,50,50,50,50,50">
				<Label text="Requested by" col="0" row="0"/>
				<Label :text="details.Requestor_name" row="0" col="1"/>
				<Label text="Departing From" col="0" row="1"/>
				<Label :text="details.Departure_Frm" row="1" col="1"/>
				<Label text="Arriving To" row="2" col="0"/>
				<Label :text="details.Departure_To" row="2" col="1"/>
				<Label text="Departure Date" row="3" col="0"/>
				<Label :text="details.Departure_Date" row="3" col="1"/>
				<Label text="Return Date" row="4" col="0"/>
				<Label :text="details.Return_Date" row="4" col="1"/>
				<Label text="Approver Name" row="5" col="0"/>
				<Label :text="details.Approver_name" row="5" col="1"/>
				<Label text="Approver Status" row="6" col="0"/>
				<Label :text="details.Approver_Status" row="6" col="1" fontWeight="bold"/>
				<Label text="Remarks" row="7" col="0"/>
				<Label :text="details.Remarks" row="7" col="1" />
				<Label text="Request Date" row="8" col="0"/>
				<Label :text="details.Request_Date" row="8" col="1"/>
				<Label text="Request Status" row="9" col="0"/>
				<Label :text="details.Request_Status" row="9" col="1" fontWeight="bold"/>
			</GridLayout>
		</StackLayout>
	</Page>
</template>
<script>
import axios from "axios";
export default {
	data() {
		return {
			details: {}
		};
	},
	props: ["id"],
	created() {
		axios.get(
			"http://220.225.138.75/MSTCInternalServices/MSTCServices.svc/GetAirTicketDetailsByTicket/" +
			this.id
		).then(response => {
			this.details = response.data.GetAirTicketDetailsByTicketResult;
		});
	}
};
</script>
